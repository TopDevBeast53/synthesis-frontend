import { useEffect } from 'react'
import { useHelixBusdPrice } from 'hooks/useBUSDPrice'

const useGetDocumentTitlePrice = () => {
    const cakePriceBusd = useHelixBusdPrice()
    useEffect(() => {
        const cakePriceBusdString = cakePriceBusd ? cakePriceBusd.toFixed(2) : ''
        document.title = `Pancake Swap - ${cakePriceBusdString}`
    }, [cakePriceBusd])
}
export default useGetDocumentTitlePrice
