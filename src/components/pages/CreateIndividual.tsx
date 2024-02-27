import React, {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {INDIVIDUAL_TYPES, GENDERS, CENTURES, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import Centum from 'centum.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {createIndividualM} from '../../graphql/pages/IndividualPageQueries'
import {CollectionPropsType, TownType} from '../../types/types'

const CreateIndividual: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [idx, setIdx] = useState<number>(0)

    const [state, setState] = useState({
        fullname: '', 
        category: INDIVIDUAL_TYPES[0], 
        sex: GENDERS[0], 
        century: CENTURES[0],
        region: towns[0].title, 
        cords: towns[0].cords,
        achievement: ''
    })

    const centum = new Centum()

    const {fullname, category, sex, century, region, cords, achievement} = state

    const [createIndividual] = useMutation(createIndividualM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.createIndividual)
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
        createIndividual({
            variables: {
                username: context.username, id, fullname, category, sex, century, region, cords, achievement
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>What {sex === 'Male' ? 'his' : 'her'} name?</h4>
                        <input value={fullname} onChange={e => setState({...state, fullname: e.target.value})} placeholder='Enter fullname' type='text' />
                
                        <h4 className='pale'>Type</h4>
                        <div className='items small'>
                            {INDIVIDUAL_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <div className='items small'>
                            <select value={sex} onChange={e => setState({...state, sex: e.target.value})}>
                                {GENDERS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={century} onChange={e => setState({...state, century: e.target.value})}>
                                {CENTURES.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>                
                    </>,
                    <>
                        <h4 className='pale'>Main Achievement</h4>

                        <textarea value={achievement} onChange={e => setState({...state, achievement: e.target.value})} placeholder='Text...' />

                        <h4 className='pale'>Place of Birth</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                    </>
                ]} 
            >
                <h2>New Individual</h2>
            </FormPagination>

            <button onClick={onCreate}>Create</button>
        </div>
    )
}

export default CreateIndividual