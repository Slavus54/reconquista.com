import React, {useState, useMemo, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {STORY_TYPES, STOPY_STATUSES, CHAPTER_TYPES, RELIGIONS, COLLECTION_LIMIT, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import Centum from 'centum.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import ImageLoader from '../UI/ImageLoader'
import {ModernAlert} from '../UI/ModernAlert'
import {createStoryM} from '../../graphql/pages/StoryPageQueries'
import {CollectionPropsType, TownType} from '../../types/types'

const CreateStory: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [idx, setIdx] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [chapter, setChapter] = useState({
        content: '',
        format: CHAPTER_TYPES[0]
    })

    const [state, setState] = useState({
        title: '', 
        category: STORY_TYPES[0], 
        religion: RELIGIONS[0], 
        status: STOPY_STATUSES[0],
        chapters: [],
        region: towns[0].title, 
        cords: towns[0].cords,
        goal: '', 
        card: ''
    })

    const centum = new Centum()

    const {title, category, religion, status, chapters, region, cords, goal, card} = state
    const {content, format} = chapter

    const [createStory] = useMutation(createStoryM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.createStory)
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

    const onChapter = () => {
        if (chapters.length < COLLECTION_LIMIT) {
            setState({...state, chapters: [...chapters, {...chapter, image}]})
        }
      
        setChapter({
            content: '',
            format: CHAPTER_TYPES[0]
        })
        setImage('')
    }

    const onCreate = () => {
        createStory({
            variables: {
                username: context.username, id, title, category, religion, status, chapters, region, cords, goal, card: centum.card(card)
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
                            {STORY_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <div className='items small'>
                            <select value={religion} onChange={e => setState({...state, religion: e.target.value})}>
                                {RELIGIONS.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                {STOPY_STATUSES.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>                
                    </>,
                    <>
                        <h4 className='pale'>Story's Chapters ({chapters.length}/{COLLECTION_LIMIT})</h4>
                        <textarea value={content} onChange={e => setChapter({...chapter, content: e.target.value})} placeholder='Text...' />
                        <div className='items small'>
                            {CHAPTER_TYPES.map(el => <div onClick={() => setChapter({...chapter, format: el})} className={el === format ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <ImageLoader setImage={setImage} />

                        <button onClick={onChapter}>+</button>                        
                    </>,
                    <>
                        <h4 className='pale'>Charity Information</h4>
                        <textarea value={goal} onChange={e => setState({...state, goal: e.target.value})} placeholder='Text of Purpose...' />
                        <input value={card} onChange={e => setState({...state, card: e.target.value})} placeholder='Card number' type='text' />

                        <h4 className='pale'>Place of Birth</h4>
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
                <h2>New Ukrainian Story</h2>
            </FormPagination>     
        </div>
    )
}

export default CreateStory