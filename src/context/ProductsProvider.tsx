import { ReactElement, createContext, useEffect, useState } from "react";


export type ProductType = {
    sku: string;
    name: string;
    price: number;
    description: string;
    basketLimit: number;
}

const initialState: ProductType[] = []

// const initialState: ProductType[] = [
//   {
//     sku: 1,
//     name: 'Product One',
//     description: 'Product One description',
//     price: 1.11,
//     basketLimit: 5,
//   },
//   {
//     sku: 2,
//     name: 'Product Two',
//     description: 'Product Two description',
//     price: 2.22,
//     basketLimit: 4,
//   },
//   {
//     sku: 3,
//     name: 'Product Three',
//     description: 'Product Three description',
//     price: 3.33,
//     basketLimit: 3,
//   },
//   {
//     sku: 4,
//     name: 'Product Four',
//     description: 'Product Four description',
//     price: 4.44,
//     basketLimit: 2,
//   },
//   {
//     sku: 5,
//     name: 'Product Five',
//     description: 'Product Five description',
//     price: 5.55,
//     basketLimit: 1,
//   },
// ];


export type UseProductContextType = {products: ProductType[]}

const initContextState: UseProductContextType = {products: []}

type ChildrenType = {children? : ReactElement | ReactElement[]}
const ProductsContext = createContext<UseProductContextType>(initContextState)


export const ProductsProvider = ({children} : ChildrenType) : ReactElement => {
    const [products, setProducts] = useState<ProductType[]>(initialState)


    useEffect(()=>{

        const fetchProducts = async () : Promise<ProductType[]> =>{
                const data = await fetch('http://localhost:3500/products').then(response =>{
                    return response.json()
                }).catch(error =>{if(error instanceof Error) throw error}  )

                return data
        }

        fetchProducts().then(response => setProducts(response))

    },[])

    return (
        <ProductsContext.Provider value={{products}}>
            {children}
        </ProductsContext.Provider>
    )
}


export default ProductsContext