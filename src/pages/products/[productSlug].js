import Head from 'next/head'

import Layout from '@components/Layout';
import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';
import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";

import styles from '@styles/Product.module.scss'

export default function Product({ product }) {
  return (
    <Layout>
      <Head>
        <title>{ product.name }</title>
        <meta name={ product.name } content={`Buy ${product.name} at Jelly Commerce`} />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            {/* Image */}
            <img width={product.image.width} height={product.image.height} src={product.image.url} alt="" />
          </div>
          <div className={styles.productContent}>
            <h1>{ product.name }</h1>
            <div className={styles.productDescription} dangerouslySetInnerHTML={{ 
              __html: product.description?.html 
            }}/>
            <p className={styles.productPrice}>
              ${ product.price  }
            </p>
            <p className={styles.productBuy}>
              <Button>
                Add to Cart
              </Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const client = new ApolloClient({
    uri: 'https://api-eu-west-2.graphcms.com/v2/cl2ina4w15be201xm7b7u84d5/master',
    cache: new InMemoryCache()
  });

  const data = await client.query({
    query: gql`
      query PageProduct($slug: String) {
        product(where: {slug: $slug}) {
          id
          image
          name
          price
          description {
            html
          }
        }
      }
    `,
    variables: {
      slug: params.productSlug
    }
  })

  const product = data.data.product;

  return {
    props: {
      product
    }
  }
}

export async function  getStaticPaths() {
  const client = new ApolloClient({
    uri: 'https://api-eu-west-2.graphcms.com/v2/cl2ina4w15be201xm7b7u84d5/master',
    cache: new InMemoryCache()
  });

  const data = await client.query({
    query: gql`
      query PageProducts {
        products {
          name
          price
          slug
          image
        }
      }
    `
  })

  const paths = data.data.products.map(product => {
    return {
      params: {
        productSlug: product.slug
      }
    }
  })

  return {
    paths,
    fallback: false
  }
}