import React, { useState, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useLocation, useHistory } from 'react-router-dom';
import { Steps, Button, message, Card } from 'antd';
import NftDetails from '../components/NftDetails';
import UnlockableContent from '../components/UnlockableContent';
import Preview from '../components/Preview';
import { getNetworkConnectParams } from 'utils/chains';
import Swal from 'sweetalert2';
import { makeContract, formatError, getContractsByTenantAndChain } from 'utils';
import NFTABI from 'constants/contracts/NFT';
import MarketContract from 'constants/contracts/Market';
import { NftContext } from 'modules/nft/Context';
import { LISTING_TYPES } from 'constants/index';
import { AppContext } from 'modules/app/Context';

const { Step } = Steps;

const steps = [
  {
    title: 'NFT Details',
  },
  {
    title: 'Unlockable Content',
  },
  {
    title: 'Preview',
  },
];

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const AddNft = (props) => {
  const history = useHistory();
  const state = useLocation()?.state || {};
  const { account, library, chainId } = useWeb3React();
  const { defaultCollection = '' } = state;
  const [current, setCurrent] = useState(0);
  const [uploadedFile, setUploadedFile] = useState('');
  const [hasUnlockableContent, setHasUnlockableContent] = useState(false);
  const [unlockableContent, setUnlockableContent] = useState([]);
  const [nftDetails, setNftDetails] = useState(null);
  const [network, setNetwork] = useState(null);
  const [submit, setSubmit] = useState(false);
  const { addNft, uploadNft } = useContext(NftContext);
  const { uploadToFleek } = useContext(AppContext);
  const [publish, setPublish] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  const [submitLoading, setSubmitLoading] = useState(false);

  const handleNext = async () => {
    let toAdd = 1;
    if (current === 0 && !hasUnlockableContent) toAdd = 2;
    setCurrent(current + toAdd);
  };

  const handleFormSubmit = () => {
    setSubmit(true);
  };

  const handlePrevious = () => {
    let toSubtract = 1;
    if (current === 2 && !hasUnlockableContent) toSubtract = 2;
    setCurrent(current - toSubtract);
  };

  const handleCoverImage = (fileValue) => {
    const { file } = fileValue;
    getBase64(file.originFileObj, (url) => {
      setCoverImage({ url, file });
    });
  };

  const handleNewUnlockableContent = (payload) => {
    setUnlockableContent([...unlockableContent, payload]);
  };

  const handleDeleteUnlockableContent = (key) => {
    const filtered = unlockableContent?.filter((d) => d.asset_key !== key);
    setUnlockableContent(filtered);
  };

  const handleNetworkChange = (value) => {
    setNetwork(value);
  };

  const handleUploadChange = ({ file }) => {
    setUploadLoading(true);
    switch (file.type) {
      case 'image/gif':
      case 'image/jpeg':
      case 'image/png':
      case 'image/webp':
        getBase64(file.originFileObj, (url) => {
          setUploadedFile({ type: 'image', url, file });
        });
        break;
      case 'audio/mpeg':
        getBase64(file.originFileObj, (url) => {
          setUploadedFile({ type: 'audio', url, file });
        });
        break;
      case 'video/mp4':
        getBase64(file.originFileObj, (url) => {
          setUploadedFile({ type: 'video', url, file });
        });
        break;
      case 'application/x-zip-compressed':
        getBase64(file.originFileObj, (url) => {
          setUploadedFile({ type: 'zip', url, file });
        });
        break;
      default:
        getBase64(file.originFileObj, (url) => {
          setUploadedFile({ type: 'file', url, file });
        });
        break;
    }
    setUploadLoading(false);
  };

  const checkMetamaskNetwork = async (networkId) => {
    if (chainId.toString() !== networkId.toString()) {
      const param_options = await getNetworkConnectParams(networkId);
      const changeNetwork = await Swal.fire({
        title: `Switch Network`,
        text: `Switch your Network to ${param_options.chainName}`,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });
      if (changeNetwork.isConfirmed) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [param_options],
        });
        return false;
      } else {
        message.error(`couldn't switch network`);
        return false;
      }
    }
    return true;
  };

  const fetchContractsByChain = async () => {
    return getContractsByTenantAndChain(chainId);
  };

  const uploadMedia = (url) => {
    if (!url) return;
    return uploadToFleek({ file: url });
  };

  const checkAndApprove = async (contracts) => {
    const NFT_Contract = makeContract(library, NFTABI.abi, contracts.erc721);
    const approved = await NFT_Contract.methods.isApprovedForAll(account, contracts.marketplace).call();
    if (approved) return approved;
    const swal = await Swal.fire({
      title: `Allow to marketplace?`,
      text: `You need to allow marketplace to sale your item`,
      showCancelButton: true,
      confirmButtonText: 'Allow to sale',
      cancelButtonText: 'Dont allow to sale',
    });
    if (swal.isConfirmed) {
      message.loading('Approving to sale...', 0);
      return NFT_Contract.methods.setApprovalForAll(contracts.marketplace, true).send({ from: account });
    } else return false;
  };

  const handleFinish = async () => {
    try {
      if (!account) return message.error('Please connect your wallet');
      if (!uploadedFile) return message.error('Please upload an nft');
      const { fiat, ...values } = nftDetails;
      if (fiat <= 0.5) return message.error('Please set your price to be greater than 0.5 EUR');
      if (!values.network) return message.error('Please select blockchain network');
      const validNetwork = await checkMetamaskNetwork(values.network);
      if (!validNetwork) return;
      // if (chainId !== values.network) throw Error('Selected network must match with your wallet network');
      setSubmitLoading(true);
      const { contracts } = await fetchContractsByChain();
      if (!contracts) return message.error('Contracts not available, Please contact system admin!');
      const approved = await checkAndApprove(contracts);
      message.destroy();
      if (!approved) return;
      const contract = makeContract(library, MarketContract.abi, contracts.marketplace);
      const nftData = {
        file: uploadedFile.url,
        metadata: {
          name: values.name,
          description: values.description,
          network: values.network,
          price: values.price,
          minter: account,
          media_type: values.media_type,
          mintage_type: values.mintage_type,
          is_featured: values.is_featured || false,
          unlockableContent: unlockableContent || [],
        },
      };
      const uploadedNft = await uploadNft(nftData);
      if (!uploadedNft) return message.error('Failed to upload NFT');
      if (coverImage?.url) {
        const { hash: coverHash } = await uploadMedia(coverImage?.url);
        if (!coverHash) {
          message.error('Failed to upload cover image');
          return;
        }
        nftData.metadata.cover_image = coverHash;
        message.success('Cover Image Uploaded');
      }
      nftData.metadata.token_uri = uploadedNft.tokenUri;
      nftData.metadata.preview_image = uploadedNft.tokenUriData.image;
      nftData.metadata.bundle = values.bundle;
      nftData.metadata.categories = values.categories;
      message.destroy();
      message.loading('Waiting for Transaction Confirmation!', 0);
      const nft_contract_addr = contracts.erc721;
      const mintedTx = await contract.methods
        .createNftForSale(
          nft_contract_addr,
          uploadedNft.tokenUri,
          library.utils.toWei(values.price.toString(), 'ether')
        )
        .send({ from: account });
      message.destroy();
      nftData.metadata.token_id = mintedTx.events.MarketItemCreated.returnValues.tokenId;
      nftData.metadata.listing_type = LISTING_TYPES.SALE;
      nftData.metadata.contracts = {
        nft: contracts.erc721,
        marketplace: contracts.marketplace,
      };
      nftData.metadata.is_published = publish;
      await addNft(nftData.metadata);
      message.success(`Created ${values.name} NFT`);
      history.push('/admin/nfts/nft-list');
    } catch (err) {
      const errMsg = formatError(err);
      message.error(errMsg).then(() => {
        message.destroy();
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Card className="text-center">
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </Card>

      <div className="d-flex justify-content-end mt-3">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={current === 0 ? handleFormSubmit : handleNext}>
            Next
          </Button>
        )}
      </div>

      <div className="steps-action mt-2" style={{ textAlign: 'right' }}>
        {current > 0 && (
          <Button style={{ marginLeft: 8 }} onClick={handlePrevious}>
            Previous
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleFinish} loading={submitLoading}>
            Create NFT
          </Button>
        )}
      </div>
      <div className="steps-content">
        {current === 0 && (
          <NftDetails
            step={current}
            submit={submit}
            setSubmit={setSubmit}
            nftDetails={nftDetails}
            setNftDetails={setNftDetails}
            handleNetwork={handleNetworkChange}
            handleNext={handleNext}
            defaultCollection={defaultCollection}
            uploadedFile={uploadedFile}
            coverImage={coverImage}
            handleCoverImage={handleCoverImage}
            uploadLoading={uploadLoading}
            handleUploadChange={handleUploadChange}
            hasUnlockableContent={hasUnlockableContent}
            setHasUnlockableContent={setHasUnlockableContent}
            publish={publish}
            setPublish={setPublish}
          />
        )}
        {current === 1 && (
          <UnlockableContent
            unlockableContent={unlockableContent}
            handleNewUnlockableContent={handleNewUnlockableContent}
            handleDeleteUnlockableContent={handleDeleteUnlockableContent}
          />
        )}
        {current === 2 && (
          <Preview
            unlockableContent={unlockableContent}
            uploadedFile={uploadedFile}
            details={nftDetails}
            network={network}
            coverImage={coverImage}
          />
        )}
      </div>
    </>
  );
};

export default AddNft;
