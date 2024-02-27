import {FormPaginationProps} from '../../types/types'
import LeftArrow from '../../assets/left.png'
import RightArrow from '../../assets/right.png'

const FormPagination: React.FC<FormPaginationProps> = ({children, num, setNum, items = []}) => {
    return (
        <>
            <div className='items small form-back'>
                <img onClick={() => num > 0 && setNum(num - 1)} src={LeftArrow} className='icon' alt='prev' />
                {children}
                <img onClick={() => num < items.length - 1 && setNum(num + 1)} src={RightArrow} className='icon' alt='next' />
            </div>
            {items[num]}           
        </>
    )
}

export default FormPagination