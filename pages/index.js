import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Banner from '../components/banner';
import Card from '../components/card';
import styles from '../styles/Home.module.css';
import coffeeStoresData from '../data/coffee-stores.json';
import { fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/use-track-location';
import { ACTION_TYPES, StoreContext } from '../store/store-context';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  // const [coffeeStores, setCoffeeStores] = useState('');
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latlong } = state;

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latlong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latlong=${latlong}&limit=30`
          );
          const coffeeStores = await response.json();

          // setCoffeeStores(fetchedCoffeeStores);
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores,
            },
          });
          setCoffeeStoresError('');
        } catch (error) {
          // console.log({ error });
          setCoffeeStoresError(error.message);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [dispatch, latlong]);

  const handleOnBannerButtonClick = () => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta
          name='description'
          content='Allows you to discover coffee Stores'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnBannerButtonClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src='/static/hero-image.png'
            alt='Hero Image'
            width={700}
            height={400}
          />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
