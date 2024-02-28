import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import Centum from 'centum.js'
import {LAND_TYPES, CENTURES, SEARCH_PERCENT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../env/env'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import Loading from '../UI/Loading'
import {getLandsQ} from '../../graphql/pages/LandPageQueries'
import {TownType, Cords} from '../../types/types'

const Lands: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(LAND_TYPES[0])
    const [century, setCentury] = useState<string>(CENTURES[0])
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)
    const [lands, setLands] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const {data, loading} = useQuery(getLandsQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setLands(data.getLands)

            centum.title('Lands', PROJECT_TITLE)
            centum.favicon('favicon-lands')
        }
    }, [data])

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setRegion(result.title)
                setCords(result.cords)
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        if (lands !== null) {
            let result: any[] = lands.filter(el => el.century === century && el.region === region)

            if (title !== '') {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT, true))
            }

            result = result.filter(el => el.category === category)

            setFiltered(result)
        }   
    }, [lands, title, category, century, region])

    return (
        <>          
            <h1>European Lands</h1>

            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Title</h4>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Title of land' type='text' />
                </div>
                <div className='item'>
                    <h4 className='pale'>Location</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Nearest town' type='text' />
                </div>
            </div>

            <h4 className='pale'>Type and Century</h4>
    
            <div className='items small'>
                {LAND_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>

            <select value={century} onChange={e => setCentury(e.target.value)}>
                {CENTURES.map(el => <option value={el}>{el}</option>)}
            </select>  

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Lands on Map:' />

            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <NavigatorWrapper url={`/land/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.title)}
                            </NavigatorWrapper>
                        </Marker>
                    )}
                </ReactMapGL> 
            }
            {loading && <Loading />}
        </>
    )
}

export default Lands