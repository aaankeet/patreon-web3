import React from 'react';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { ethers } from 'ethers';
import axios from 'axios';

function Header() {
  const { push } = useRouter();
  const { status } = useSession();

  async function connectWalletHandler() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();

    const userData = { address: signer.address, chain: 80001 };

    const { data } = await axios.post('./api/request-message', userData, {
      headers: {
        'content-type': 'application/json',
      },
    });
    const message = data.message;
    const signature = await signer.signMessage(message);

    const { url } = await signIn('credentials', {
      message,
      signature,
      redirect: false,
      callbackUrl: '/',
    });
    push('/');
  }

  return (
    <header className={styles.header}>
      <div className={styles.leftH}>
        <div className={styles.headerItem}>Product</div>
        <div className={styles.headerItem}>Creators</div>
        <div className={styles.headerItem}>Pricing</div>
        <div className={styles.headerItem}>Resources</div>
      </div>
      <div className={styles.rightH}>
        {status === 'authenticated' ? (
          <div className={styles.connectButton} onClick={() => signOut()}>
            Disconnect
          </div>
        ) : (
          <div className={styles.connectButton} onClick={connectWalletHandler}>
            Connect
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
