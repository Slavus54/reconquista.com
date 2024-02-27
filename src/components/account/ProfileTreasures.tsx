import {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
//@ts-ignore
import Centum from 'centum.js'
import {TREASURE_TYPES, CENTURES} from '../../env/env'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import DataPagination from '../UI/DataPagination'
import CloseIt from '../UI/CloseIt'
import {ModernAlert} from '../UI/ModernAlert'
import {manageProfileTreasureM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const ProfileTreasures = ({profile, context}: AccountPageComponentProps) => {
    const [treasures, setTreasures] = useState<any[]>([])
    const [treasure, setTreasure] = useState<any | null>(null)
    const [image, setImage] = useState<string>('')
    const [state, setState] = useState({
        title: '', 
        category: TREASURE_TYPES[0], 
        century: CENTURES[0] 
    })

    const centum = new Centum()

    const {title, category, century} = state

    const [manageProfileTreasure] = useMutation(manageProfileTreasureM, {
        onCompleted(data) {
            ModernAlert(data.manageProfileTreasure)
        }
    })

    const onManageTreasure = (option: string) => {
        manageProfileTreasure({
            variables: {
                account_id: context.account_id, option, title, category, century, image, coll_id: treasure === null ? '' : treasure.shortid
            }
        })
    }

    return (
        <>
            {treasure === null ? 
                    <>
                        <h2>New Treasure</h2>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of treasure...' />

                        <h4 className='pale'>Type and Century</h4>
                        <div className='items small'>
                            {TREASURE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <select value={century} onChange={e => setState({...state, century: e.target.value})}>
                            {CENTURES.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <ImageLoader setImage={setImage} />

                        <button onClick={() => onManageTreasure('create')}>Create</button>

                        <DataPagination initialItems={profile.treasures} setItems={setTreasures} label='List of treasures:' />

                        <div className='items half'>
                            {treasures.map(el => 
                                <div onClick={() => setTreasure(el)} className='item panel'>
                                    {centum.shorter(el.title)}
                                    <h5 className='pale'><b>{el.likes}</b> likes</h5>
                                </div>    
                            )}
                        </div>
                    </>
                :
                    <>
                        <CloseIt onClick={() => setTreasure(null)} />

                        {treasure.image !== '' && <ImageLook src={treasure.image} className='photo_item' alt='treasure photo' />}

                        <h2>{treasure.title}</h2>

                        <div className='items small'>
                            <h4 className='pale'>Type: {treasure.category}</h4>
                            <h4 className='pale'>Century: {treasure.century}</h4>
                        </div>

                        <button onClick={() => onManageTreasure('delete')}>Delete</button>
                    </>
            }
        </> 
    )
}

export default ProfileTreasures