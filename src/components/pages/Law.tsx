import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {POLITICAL_TYPES, ISSUE_LEVELS, LAW_STATUSES, INITIAL_PERCENT} from '../../env/env'
import {Context} from '../../context/WebProvider'
import DataPagination from '../UI/DataPagination'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import Loading from '../UI/Loading'
import {ModernAlert} from '../UI/ModernAlert'
import {getLawM, manageLawVersionM, updateLawInfoM, makeLawIssueM} from '../../graphql/pages/LawPageQueries'
import {CollectionPropsType} from '../../types/types'

const Law: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [image, setImage] = useState<string>('')
    const [law, setLaw] = useState<any | null>(null)
    const [versions, setVersions] = useState<any[]>([])
    const [version, setVersion] = useState<any | null>(null)
    const [issues, setIssues] = useState<any[]>([])
    const [issue, setIssue] = useState<any | null>(null)
    const [state, setState] = useState({
        text: '',
        category: POLITICAL_TYPES[0],
        title: '',
        level: ISSUE_LEVELS[0],
        status: LAW_STATUSES[0],
        rating: INITIAL_PERCENT
    })

    const centum = new Centum()
    const datus = new Datus()

    const {text, category, title, level, status, rating} = state

    const [getLaw] = useMutation(getLawM, {
        onCompleted(data) {
            setLaw(data.getLaw)
        }
    })

    const [manageLawVersion] = useMutation(manageLawVersionM, {
        onCompleted(data) {
            ModernAlert(data.manageLawVersion)
        }
    })

    const [updateLawInfo] = useMutation(updateLawInfoM, {
        onCompleted(data) {
            ModernAlert(data.updateLawInfo)
        }
    })

    const [makeLawIssue] = useMutation(makeLawIssueM, {
        onCompleted(data) {
            ModernAlert(data.makeLawIssue)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getLaw({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (law !== null) {
            setState({...state, status: law.status, rating: law.rating})
        }
    }, [law])

    const onManageVersion = (option: string) => {
        manageLawVersion({
            variables: {
                username: context.username, id, option, text, category, coll_id: version === null ? '' : version.shortid
            }
        })
    }

    const onUpdateInfo = () => {
        updateLawInfo({
            variables: {
                username: context.username, id, status, rating
            }
        })
    }   

    const onMakeIssue = () => {
        makeLawIssue({
            variables: {
                username: context.username, id, title, level, image, timestamp: datus.timestamp()
            }
        })
    }

    return (
        <>          
            {law !== null &&
                <>
                    <h1>{law.title}</h1>

                    <div className='items small'>
                        <h4 className='pale'>Type: {law.category}</h4>
                        <h4 className='pale'>Size: {law.size}</h4>
                    </div>

                    {version === null ?
                            <>
                                <h2>New Version</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Statement of law...' />

                                <h4 className='pale'>Orientation</h4>
                                <div className='items small'>
                                    {POLITICAL_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <button onClick={() => onManageVersion('create')}>Offer</button>

                                <DataPagination initialItems={law.versions} setItems={setVersions} label='Versions of law:' />
                                <div className='items half'>
                                    {versions.map(el => 
                                        <div onClick={() => setVersion(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <p>{el.category}</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setVersion(null)} />

                                <h2>{version.name}'s version</h2>

                                <p>Statement: {version.text}</p>

                                <div className='items small'>
                                    <h4 className='pale'>Orientation: {version.category}</h4>
                                    <h4 className='pale'><b>{version.likes}</b> likes</h4>
                                </div>  

                                {version.name === context.username ? 
                                        <button onClick={() => onManageVersion('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageVersion('like')}>Like</button>
                                }
                            </>
                    }

                    <h2>Information</h2>
                    <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                        {LAW_STATUSES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <h4 className='pale'>Rating: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                    <button onClick={onUpdateInfo} className='light'>Update</button>

                    {issue === null ? 
                            <>
                                <h2>Own Issue</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of problem...' />

                                <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                    {ISSUE_LEVELS.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <ImageLoader setImage={setImage} />

                                <button onClick={onMakeIssue}>Publish</button>

                                <DataPagination initialItems={law.issues} setItems={setIssues} label='List of issues:' />
                                <div className='items half'>
                                    {issues.map(el => 
                                        <div onClick={() => setIssue(el)} className='item card'>
                                            {centum.shorter(el.title)}
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setIssue(null)} />

                                {issue.image !== '' && <ImageLook src={issue.image} className='photo_item' alt='issue photo' />}

                                <h2>{issue.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Level: {issue.level}</h4>
                                    <h4 className='pale'>Date: {issue.timestamp}</h4>
                                </div>
                            </>
                    }
                </> 
            }
            {law === null && <Loading />}
        </>
    )
}

export default Law