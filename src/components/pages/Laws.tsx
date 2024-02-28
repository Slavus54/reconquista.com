import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useQuery} from '@apollo/client'
import Centum from 'centum.js'
import {LAW_TYPES, SIZES, SEARCH_PERCENT, PROJECT_TITLE} from '../../env/env'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import DataPagination from '../UI/DataPagination'
import Loading from '../UI/Loading'
import {getLawsQ} from '../../graphql/pages/LawPageQueries'
import {TownType} from '../../types/types'

const Laws: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [towns] = useState<TownType[]>(gain())
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(LAW_TYPES[0])
    const [size, setSize] = useState<string>(SIZES[0])
    const [region, setRegion] = useState<string>(towns[0].title)
    const [laws, setLaws] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const {data, loading} = useQuery(getLawsQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setLaws(data.getLaws)

            centum.title('Laws', PROJECT_TITLE)
            centum.favicon('favicon-laws')
        }
    }, [data])

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setRegion(result.title)
            }           
        }
    }, [region])

    useMemo(() => {
        if (laws !== null) {
            let result: any[] = laws.filter(el => el.region === region && el.size === size)

            if (title !== '') {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT, true))
            }

            result = result.filter(el => el.category === category)

            setFiltered(result)
        }   
    }, [laws, title, category, size, region])

    return (
        <>          
            <h1>Legal Future</h1>

            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Title</h4>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Statement of law' type='text' />
                </div>
                <div className='item'>
                    <h4 className='pale'>Own Location</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Nearest town' type='text' />
                </div>
            </div>

            <h4 className='pale'>Type and Size</h4>
            <div className='items small'>
                {LAW_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>

            <select value={size} onChange={e => setSize(e.target.value)}>
                {SIZES.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination initialItems={filtered} setItems={setFiltered} label='List of laws:' />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <NavigatorWrapper url={`/law/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.title)}
                            </NavigatorWrapper>
                        </div>
                    )}
                </div> 
            }
            {loading && <Loading />}
        </>
    )
}

export default Laws