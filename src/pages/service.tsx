import { GetServerSideProps } from 'next';
import { fetchHandler } from '@/client';

const Service = ({data}:{data:any}) => {

    return (
        <div>
            {JSON.stringify(data)}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const response = await fetchHandler('/todos/1', 'get', '2')
    return {
        props: {
            data: response
        },
    }
}
export default Service