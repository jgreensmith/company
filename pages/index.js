import Layout from "../components/common/Layout";


export default function Home() {

  const connect = async () => {
     await fetch('/api/register', {method: 'GET'}).then((res) => res.json)
  }
  
  return (
    <Layout title='home' seo='seo home page dank boi'>
      <button onClick={connect}>connect to db</button>
    </Layout>
  )
}
