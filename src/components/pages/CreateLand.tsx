import React, {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {LAND_TYPES, CENTURES, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import Centum from 'centum.js'
import {Datus, date_filters} from 'datus.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {createLandM} from '../../graphql/pages/LandPageQueries'
import {CollectionPropsType, TownType} from '../../types/types'

const CreateLand: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [idx, setIdx] = useState<number>(0)

    const datus = new Datus()

    const [state, setState] = useState({
        title: '', 
        category: LAND_TYPES[0], 
        century: CENTURES[0], 
        region: towns[0].title, 
        cords: towns[0].cords,
        timestamp: datus.timestamp(), 
        period: date_filters[0]
    })

    const centum = new Centum()

    const {title, category, century, region, cords, timestamp, period} = state

    const [createLand] = useMutation(createLandM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.createLand)
        }
    })

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setState({...state, region: result.title, cords: result.cords})
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    const onCreate = () => {
        createLand({
            variables: {
                username: context.username, id, title, category, century, region, cords, timestamp, period
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Title</h4>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Enter title' />
                
                        <h4 className='pale'>Type</h4>
                        <div className='items small'>
                            {LAND_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <h4 className='pale'>Century of foundation and period of visiting</h4>
                        <div className='items small'>
                            <select value={century} onChange={e => setState({...state, century: e.target.value})}>
                                {CENTURES.map(el => <option value={el}>{el}</option>)}
                            </select>             
                            <select value={period} onChange={e => setState({...state, period: e.target.value})}>
                                {date_filters.map(el => <option value={el}>{el}</option>)}
                            </select> 
                        </div>
                    </>,
                    <>
                        <h4 className='pale'>Location</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    
                        <button onClick={onCreate}>Create</button>
                    </>
                ]} 
            >
                <h2>New European Land</h2>
            </FormPagination>     
        </div>
    )
}

export default CreateLand