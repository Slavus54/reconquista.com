import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {QUESTION_TYPES, SHARING_TYPES, CHAPTER_TYPES, INITIAL_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import Loading from '../UI/Loading'
import {ModernAlert} from '../UI/ModernAlert'
import {getStoryM, makeStoryChapterM, manageStoryQuestionM, updateStoryInfoM, makeStorySharingM} from '../../graphql/pages/StoryPageQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Story: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [image, setImage] = useState<string>('')
    const [isAuthor, setIsAuthor] = useState<boolean>(false)
    const [story, setStory] = useState<any | null>(null)
    const [sharings, setSharings] = useState<any[]>([])
    const [sharing, setSharing] = useState<any | null>(null)
    const [question, setQuestion] = useState<any | null>(null)
    const [chapters, setChapters] = useState<any[]>([])
    const [chapter, setChapter] = useState<any | null>(null)

    const datus = new Datus()

    const [state, setState] = useState({
        goal: '',
        card: '',
        content: '',
        format: CHAPTER_TYPES[0],
        text: '',
        category: QUESTION_TYPES[0],
        reply: '',
        position: SHARING_TYPES[0],
        rating: INITIAL_PERCENT,
        dateUp: datus.move()
    })

    const centum = new Centum()

    const {goal, card, content, format, text, category, reply, position, rating, dateUp} = state

    const [getStory] = useMutation(getStoryM, {
        onCompleted(data) {
            setStory(data.getStory)
        }
    })

    const [makeStoryChapter] = useMutation(makeStoryChapterM, {
        onCompleted(data) {
            ModernAlert(data.makeStoryChapter)
        }
    })

    const [manageStoryQuestion] = useMutation(manageStoryQuestionM, {
        onCompleted(data) {
            ModernAlert(data.manageStoryQuestion)
        }
    })

    const [updateStoryInfo] = useMutation(updateStoryInfoM, {
        onCompleted(data) {
            ModernAlert(data.updateStoryInfo)
        }
    })

    const [makeStorySharing] = useMutation(makeStorySharingM, {
        onCompleted(data) {
            ModernAlert(data.makeStorySharing)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getStory({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (story !== null) {
            setState({...state, goal: story.goal, card: centum.card(story.card, false)})

            setCords(story.cords)
            setIsAuthor(story.username === context.username)
        }
    }, [story])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        if (question !== null) {
            setState({...state, reply: question.answered ? question.reply : ''})
        }
    }, [question])

    const onLookQuestion = () => {
        let result = centum.random(story.questions)?.value

        if (result !== undefined) {
            setQuestion(result)
        }
    }

    const onMakeChapter = () => {
        makeStoryChapter({
            variables: {
                username: context.username, id, content, format, image
            }
        })
    }

    const onManageQuestion = (option: string) => {
        manageStoryQuestion({
            variables: {
                username: context.username, id, position, option, text, category, coll_id: question === null ? '' : question.shortid, reply  
            }
        })
    } 

    const onUpdateInfo = () => {
        updateStoryInfo({
            variables: {
                username: context.username, id, goal, card: centum.card(card)
            }
        })
    }

    const onMakeSharing = () => {
        makeStorySharing({
            variables: {
                username: context.username, id, position, rating, dateUp
            }
        })
    }

    return (
        <>          
            {story !== null &&
                <>
                    <h2>{story.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Type: {story.category}</h4>
                        <h4 className='pale'>Status: {story.status}</h4>
                    </div>

                    {isAuthor &&
                        <>
                            <h2>New Chapter</h2>

                            <textarea value={content} onChange={e => setState({...state, content: e.target.value})} placeholder='Text...' />

                            <h4 className='pale'>Theme</h4>
                            <div className='items small'>
                                {CHAPTER_TYPES.map(el => <div onClick={() => setChapter({...chapter, format: el})} className={el === format ? 'item label active' : 'item label'}>{el}</div>)}
                            </div>

                            <ImageLoader setImage={setImage} />

                            <button onClick={onMakeChapter}>Publish</button>

                            <h4 className='pale'>Charity Information</h4>
                            <textarea value={goal} onChange={e => setState({...state, goal: e.target.value})} placeholder='Text of Purpose...' />
                            <input value={card} onChange={e => setState({...state, card: e.target.value})} placeholder='Card number' type='text' />

                            <button onClick={onUpdateInfo} className='light'>Update</button>
                        </>
                    }

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 

                    {!isAuthor &&
                        <>
                            <h2>New Question</h2>
                            <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Text...' />

                            <h4 className='pale'>Type</h4>
                            <div className='items small'>
                                {QUESTION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                            </div>

                            <button onClick={() => onManageQuestion('create')}>Ask</button>

                            <h2>Purpose: {story.goal}</h2>
                            <h4 className='pale'>Card: {story.card}</h4>

                            <h2>Share story with {position}</h2>

                            <select value={position} onChange={e => setState({...state, position: e.target.value})}>
                                {SHARING_TYPES.map(el => <option value={el}>{el}</option>)}
                            </select>

                            <h4 className='pale'>Rating: {rating}%</h4>
                            <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                            <button onClick={onMakeSharing}>Share</button>
                        </>
                    }

                    {question === null ? 
                            <>
                                <h2>Questions for {isAuthor ? 'me' : story.username}</h2>

                                <button onClick={onLookQuestion} className='light'>Look</button>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuestion(null)} />

                                <h2>{question.text}?</h2>
                                <div className='items small'>   
                                    <h4 className='pale'>Type: {question.category}</h4>
                                    <h4 className='pale'><b>{question.likes}</b> likes</h4>
                                </div>

                                {question.name === context.username ? 
                                        <button onClick={() => onManageQuestion('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageQuestion('like')}>Like</button>
                                }

                                {isAuthor && !question.answered &&
                                    <>
                                        <h2>Your reply</h2>
                                        <textarea value={reply} onChange={e => setState({...state, reply: e.target.value})} placeholder='Text...' />
                                    
                                        <button onClick={() => onManageQuestion('reply')}>Answer</button>
                                    </>
                                }                              
                            </>
                    }

                    {chapter === null ? 
                            <>
                                <DataPagination initialItems={story.chapters} setItems={setChapters} label={`Story's Chapters:`} />
                                <div className='items half'>
                                    {chapters.map(el => 
                                        <div onClick={() => setChapter(el)} className='item panel'>
                                            {centum.shorter(el.content)}
                                            <p>{el.format}</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setChapter(null)} />

                                {chapter.image !== '' && <ImageLook src={chapter.image} className='photo_item' alt='chapter photo' />}

                                <h2>{chapter.content}</h2>
                                <h4 className='pale'>Type: {chapter.format}</h4>
                            </>
                    }

                    {sharing === null ? 
                            <>
                                <DataPagination initialItems={story.sharings} setItems={setSharings} label='Sharings of Story:' />
                                <div className='items half'>
                                    {sharings.map(el => 
                                        <div onClick={() => setSharing(el)} className='item card'>
                                            {centum.shorter(el.name)}
                                            <p>{el.rating}%</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setSharing(null)} />

                                <h2>{sharing.name} shared with {sharing.position}</h2>
                                <div className='items small'>
                                    <h4 className='pale'>Rating: <b>{sharing.rating}%</b></h4>
                                    <h4 className='pale'>{sharing.dateUp}</h4>
                                </div>
                            </>
                    }
                </>
            }
            {story === null && <Loading />}
        </>
    )
}

export default Story