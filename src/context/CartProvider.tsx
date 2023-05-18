import { ReactElement, createContext, useMemo, useReducer } from "react";

export type CartItemType = {
  sku: string;
  name: string;
  price: number;
  qty: number;
};

type CartStateType = { cart: CartItemType[] };

const initCartState: CartStateType = { cart: [] };

const REDUCER_ACTION_TYPE = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  QUANTITY: 'QUANTITY',
  SUBMIT: 'SUBMIT',
};

export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

export type ReducerAction = {
  type: string;
  payload?: CartItemType;
};

const reducer = (
  state: CartStateType,
  action: ReducerAction
): CartStateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.ADD: {
      if (!action.payload) {
        throw new Error('action.payload missing in ADD action');
      }

      const { sku, name, price } = action.payload;

      //filter out the iten you are adding to the cart
      const filterCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );

      //check if the item has initially been added to the cart
      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.sku === sku
      );

      //if item already exist in cart, make an addition to the qty else set the qty to be one since item has never been added
      const qty: number = itemExists ? itemExists.qty + 1 : 1;

      return { ...state, cart: [...filterCart, { sku, name, price, qty }] };
    }

    case REDUCER_ACTION_TYPE.REMOVE: {
      if (!action.payload) {
        throw new Error('action.payload missing in ADD action');
      }

      const { sku } = action.payload;

      //filter out the iten you are adding to the cart
      const filterCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );

      return { ...state, cart: [...filterCart] };
    }

    case REDUCER_ACTION_TYPE.QUANTITY: {
      if (!action.payload) {
        throw new Error('action.payload missing in ADD action');
      }
      const { sku, qty } = action.payload;

      //check if the item has initially been added to the cart
      const itemExists: CartItemType | undefined = state.cart.find(
        (item) => item.sku === sku
      );

      //filter out the iten you are adding to the cart

      if (!itemExists) {
        throw new Error('Item must exist in order to update quantity');
      }
      const updatedItems: CartItemType = { ...itemExists, qty };
      const filterCart: CartItemType[] = state.cart.filter(
        (item) => item.sku !== sku
      );
      return { ...state, cart: [...filterCart, updatedItems] };
    }

    case REDUCER_ACTION_TYPE.SUBMIT: {

        return { ...state,cart:[]}
    }

    default:
      throw new Error(`Unknown action`);
  }
};


const useCartContext = (initCartState: CartStateType)  => {
    const [state, dispatch] = useReducer(reducer, initCartState);

    const REDUCER_ACTIONS = useMemo(()=>{
            return REDUCER_ACTION_TYPE
    }, [])

    const totalItems : number = state.cart.reduce((previousValue, cartItem) =>{
            return previousValue + cartItem.qty
    }, 0)

    const totalPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(state.cart.reduce((previousValue, cartItem) =>{
        return previousValue + (cartItem.qty * cartItem.price)
    }, 0))

    const cart = state.cart.sort((a,b) =>{
        const itemA = Number(a.sku);
        const itemB = Number(b.sku);

        return itemA - itemB
    })

    return {dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart}
}

export type useCartContextType = ReturnType<typeof useCartContext>


const initCartContextState : useCartContextType = {
    dispatch: () =>{},
    REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
    totalItems: 0,
    totalPrice: '',
    cart: []


}


export const CartContext = createContext<useCartContextType>(initCartContextState)

type ChildrenType = {children?: ReactElement | ReactElement[]}

export const CartProvider = ({children} : ChildrenType): ReactElement =>{
    return (
        <CartContext.Provider value={useCartContext(initCartState)}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContext