import { GetServerSideProps } from 'next';
import { fetchHandler } from '@/client';
import { useQuery } from '@tanstack/react-query';

const About = ({ dehydratedState }: { dehydratedState: any }) => {
    const query = useQuery({ queryKey: ['todosss'], queryFn: ()=>fetchHandler('/todos/') , enabled:true})
    console.log(query.data, " == ", query.status)
    // console.log(dehydratedState, " == it is right ")
    return (
        <div>
            {query.status} 
            {/* {JSON.stringify(dehydratedState)} */}
        </div>
    );
}

// export const getServerSideProps: GetServerSideProps = async () => {
//     const response = await fetchHandler('/todos/', 'get', '1')
//     return {
//         props: {
//             dehydratedState: response
//         },
//     }
// }
export default About