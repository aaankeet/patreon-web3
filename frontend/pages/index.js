import styles from '../styles/Home.module.css';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { ethers, parseEther } from 'ethers';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { contractAddress, abi } from '@/constants';

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const { push } = useRouter();
  const { status } = useSession();

  async function purchaseNFT() {
    if (status === 'authenticated') {
      const provider = await ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = await provider.getSigner();

      const patreonContract = new ethers.Contract(contractAddress, abi, signer);

      // Mint Fee -> 0.5 Matic
      const amount = parseEther('0.5');
      const mintNft = await patreonContract.safeMint(signer.address, '', {
        value: amount,
      });

      mintNft.wait().then(async (receipt) => {
        console.log(receipt);
        console.log(receipt.log[2].topics[3]);

        const id = parseInt(receipt.log[2].topics[3]);
        const res = await axios.get('https://localhost:3000/extraMonth', {
          params: {
            id: id,
          },
        });
        messageApi.success('Patreon NFT Purchased🥳');
      });
    } else {
      messageApi.warning('please connect wallet first');
    }
  }

  return (
    <>
      {contextHolder}
      <main className={styles.main}>
        <div className={styles.firstRow}>
          <div className={styles.slogan}>
            <div className={styles.line} />
            <div className={styles.sloganText}>
              <div>Web3</div>
              <div>Powered</div>
              <div>Sharing</div>
            </div>
          </div>
          <div className={styles.creatorFrame}>
            <img
              src='/creator.png'
              alt='creator'
              className={styles.creatorImg}
            />
            <div className={styles.creatorName}>Julie</div>
            <div className={styles.imgshout}>
              Photo by{' '}
              <a href='https://unsplash.com/@joelmott?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'>
                Joel Mott
              </a>{' '}
              on{' '}
              <a href='https://unsplash.com/images/people?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'>
                Unsplash
              </a>
            </div>
          </div>
        </div>
        <div className={styles.secondRow}>
          <p className={styles.infoPara}>
            Become a patron and gain access to my exclusive content, custom
            rewards and an inside scoop into the world of Web3 on a monthly
            basis.
          </p>
          <button
            className={styles.infoButton}
            style={{ backgroundColor: '#EB5254' }}
            onClick={purchaseNFT}
          >
            Become A Patron
          </button>
          <button
            className={styles.infoButton}
            style={{ backgroundColor: 'black' }}
            onClick={() => push('/patrons')}
          >
            Already A Patron?
          </button>
        </div>
        <div className={styles.thirdRow}>
          <div className={styles.bottomStyling} />
        </div>
      </main>
    </>
  );
}

export default App;
