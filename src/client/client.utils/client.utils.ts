import { dehydrate, QueryClient } from '@tanstack/react-query';
const urlProvider = (endPoint: string): string => {
    return `https://jsonplaceholder.typicode.com${endPoint}`
}
const tokenProvider = (endPoint: string): string => {
    return ' '
}
const METHOD: any = {
    GET: 'GET',
    PUT: 'PUT',
    PATCH: 'PATCH',
    POST: 'POST',
    DELETE: 'DELETE'
}
var status_: number | any = null
const fetcher = async (url: string, option: any, queryKey?: string, queryClientArgs?: any) => {
    const response = await fetch(url, option).then((res) => {
        status_ = res.status
        return res.json()
    }).catch((err) => err)
    const queryClient = queryClientArgs ? new QueryClient(queryClientArgs) : new QueryClient()
    await queryClient.prefetchQuery({ queryKey: [queryKey ?? 'default'], queryFn: () => response })
    return dehydrate(queryClient)
}
const asyncWrapper = (promise: any) =>
    promise
        .then((data: any) => {
            const responseFilter = (response: any) => {
                const status: number | any = status_
                switch (status) {
                    case 401:
                        return ({ data: null, error: { message: " Unauthrorised  !", status: 401 } })
                    case 400:
                        return ({ data: null, error: { message: "Bad request !", status: 400 } })
                    case 404:
                        return ({ data: null, error: { message: "Not found !", status: 404 } })
                    case 500:
                        return ({ data: null, error: { message: " Internal server error  !", status: 500 } })
                    default:
                        return ({ response, error: null })
                }
            }
            if (data?.mutations?.length > 0) {
                return responseFilter(data?.queries[0].state?.data)
            } else if (data?.queries?.length > 0) {
                return responseFilter(data?.queries[0].state?.data)
            }
        })
        .catch((error: any) => ({ data: null, error }));

const fetchHandler = async (url: string,
    method?: string,
    body?: string,
    queryKey?: string,
    queryClientArgs?: any,
    header?: any
) => {
    const obj: any = new Object()
    obj.method = method ?? 'get';
    header ? obj.header = header : obj.headers = { 'Authorization': tokenProvider(url) }
    const isMutation: boolean = Boolean(METHOD['PUT'] === method?.toLocaleUpperCase() ||
        METHOD['POST'] === method?.toLocaleUpperCase() ||
        METHOD['PATCH'] === method?.toLocaleUpperCase())
    if (isMutation) {
        obj.body = JSON.stringify(body)
    }
    const response = await asyncWrapper(fetcher(urlProvider(url), obj, queryKey, queryClientArgs))
    return response
}

export { fetcher, asyncWrapper, fetchHandler }