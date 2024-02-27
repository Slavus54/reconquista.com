import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {QUOTE_TYPES, IMAGE_TYPES, INITIAL_PERCENT} from '../../env/env'
//@ts-ignore
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import DataPagination from '../UI/DataPagination'
import Loading from '../UI/Loading'
import {ModernAlert} from '../UI/ModernAlert'
import {getIndividualM, updateIndividualAchievementM, manageIndividualQuoteM, manageIndividualImageM} from '../../graphql/pages/IndividualPageQueries'
import {CollectionPropsType} from '../../types/types'

const Individual: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [source, setSource] = useState<string>('')
    const [individual, setIndividual] = useState<any | null>(null)
    const [quotes, setQuotes] = useState<any[]>([])
    const [quote, setQuote] = useState<any | null>(null)
    const [images, setImages] = useState<any[]>([])
    const [image, setImage] = useState<any | null>(null)
    const [state, setState] = useState({
        text: '',
        category: QUOTE_TYPES[0], 
        rating: INITIAL_PERCENT,
        title: '',
        format: IMAGE_TYPES[0],
        achievement: ''
    })

    const centum = new Centum()

    const {text, category, rating, title, format, achievement} = state

    const [getIndividual] = useMutation(getIndividualM, {
        onCompleted(data) {
            setIndividual(data.getIndividual)
        }
    })

    const [updateIndividualAchievement] = useMutation(updateIndividualAchievementM, {
        onCompleted(data) {
            ModernAlert(data.updateIndividualAchievement)
        }
    })

    const [manageIndividualQuote] = useMutation(manageIndividualQuoteM, {
        onCompleted(data) {
            ModernAlert(data.manageIndividualQuote)
        }
    })

    const [manageIndividualImage] = useMutation(manageIndividualImageM, {
        onCompleted(data) {
            ModernAlert(data.manageIndividualImage)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getIndividual({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (individual !== null) {
            setState({...state, achievement: individual.achievement})
        }
    }, [individual])

    useMemo(() => {
        setState({...state, rating: quote === null ? INITIAL_PERCENT : quote.rating})
    }, [quote])

    const onUpdateInfo = () => {
        updateIndividualAchievement({
            variables: {
                username: context.username, id, achievement
            }
        })
    }

    const onManageQuote = (option: string) => {
        manageIndividualQuote({
            variables: {
                username: context.username, id, option, text, category, rating, coll_id: quote === null ? '' : quote.shortid
            }
        })
    }

    const onManageImage = (option: string) => {
        manageIndividualImage({
            variables: {
                username: context.username, id, option, title, format, source, coll_id: image === null ? '' : image.shortid
            }
        })
    }

    return (
        <>       
            {individual !== null &&
                <>
                    <h1>{individual.fullname}</h1>

                    <h4 className='pale'>Main Achievement</h4>
                    <textarea value={achievement} onChange={e => setState({...state, achievement: e.target.value})} placeholder='Text...' />

                    <button onClick={onUpdateInfo} className='light'>Update</button>

                    {quote === null ? 
                            <>
                                <h2>Individual's Quote</h2>
                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Text of quote...' />

                                <h4 className='pale'>Type</h4>
                                <div className='items small'>
                                    {QUOTE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <h4 className='pale'>Rating: <b>{rating}%</b></h4>
                                <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                                <button onClick={() => onManageQuote('create')}>Publish</button>

                                <DataPagination initialItems={individual.quotes} setItems={setQuotes} label='List of quotes:' />
                                <div className='items half'>
                                    {quotes.map(el => 
                                        <div onClick={() => setQuote(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <b>{el.rating}%</b>
                                        </div>     
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuote(null)} />

                                <h3 className='pale'>{quote.category}</h3>
                                <p>Text: {quote.text}</p>
                                
                                <h4 className='pale'>Rating: <b>{rating}%</b></h4>
                                <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                                {quote.name === context.username ? 
                                        <button onClick={() => onManageQuote('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageQuote('update')}>Update</button>
                                }
                            </>
                    }

                    {image === null ? 
                            <>
                                <h2>New Image</h2>
                                <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of image' type='text' />

                                <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                    {IMAGE_TYPES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <ImageLoader setImage={setSource} />

                                <button onClick={() => onManageImage('create')}>Create</button>

                                <DataPagination initialItems={individual.images} setItems={setImages} label='Gallery:' />
                                <div className='items half'>
                                    {images.map(el => 
                                        <div onClick={() => setImage(el)} className='item card'>
                                            {centum.shorter(el.title)}
                                        </div>     
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setImage(null)} />

                                {image.source !== '' && <ImageLook src={image.source} min={16} max={16} className='photo_item' alt='image' />}

                                <h2>{image.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Type: {image.format}</h4>
                                    <h4 className='pale'><b>{image.likes}</b> likes</h4>
                                </div>

                                {image.name === context.username ? 
                                        <button onClick={() => onManageImage('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageImage('like')}>Like</button>
                                }
                            </>
                    }
                </>
            }

            {individual === null && <Loading />}
        </>
    )
}

export default Individual