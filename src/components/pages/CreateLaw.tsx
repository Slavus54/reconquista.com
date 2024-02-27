import React, {useState, useMemo, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {LAW_TYPES, LAW_STATUSES, SIZES, INITIAL_PERCENT, SEARCH_PERCENT} from '../../env/env'
import Centum from 'centum.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import FormPagination from '../UI/FormPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {createLawM} from '../../graphql/pages/LawPageQueries'
import {CollectionPropsType, TownType} from '../../types/types'

const CreateLaw: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [towns] = useState<TownType[]>(gain())
    const [idx, setIdx] = useState<number>(0)

    const [state, setState] = useState({
        title: '', 
        category: LAW_TYPES[0], 
        location: '',
        region: towns[0].title, 
        size: SIZES[0], 
        status: LAW_STATUSES[0], 
        rating: INITIAL_PERCENT 
    })

    const centum = new Centum()

    const {title, category, location, region, size, status, rating} = state

    const [createLaw] = useMutation(createLawM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.createLaw)
        }
    })

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setState({...state, region: result.title})
            }           
        }
    }, [region])

    const onCreate = () => {
        createLaw({
            variables: {
                username: context.username, id, title, category, location, region, size, status, rating
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Title</h4>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Statement...' />
                
                        <h4 className='pale'>Type</h4>
                        <div className='items small'>
                            {LAW_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <input value={location} onChange={e => setState({...state, location: e.target.value})} placeholder='Chapter, article, paragraph...' type='text' />

                        <div className='items small'>
                            <select value={size} onChange={e => setState({...state, size: e.target.value})}>
                                {SIZES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                {LAW_STATUSES.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>                
                    </>,
                    <>
                        <h4 className='pale'>My region</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
 
                        <h4 className='pale'>Rating: <b>{rating}%</b></h4>
                        <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                        <button onClick={onCreate}>Create</button>
                    </>
                ]} 
            >
                <h2>New Law</h2>
            </FormPagination>     
        </div>
    )
}

export default CreateLaw