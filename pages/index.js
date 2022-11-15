import Layout from "../components/common/Layout";
import clientPromise from "../lib/mongodb"; 



export default function Home({projects}) {

  console.log(projects)

  
  return (
    <Layout title='home' seo='seo home page dank boi'>
      home
    </Layout>
  )
}

export const getServerSideProps = async () => {
  try {
    const client = await clientPromise
     
    const projects = client.db('test').collection('users').find({}).toArray()

    
    
    if (!projects) return {notFound: true}
    //const plop = JSON.parse(JSON.stringify(projects))
    return {
      props: {
        projects: JSON.parse(JSON.stringify(projects))
        
      }
    }
  } catch (e) {
    console.log(e)

  }
} 
