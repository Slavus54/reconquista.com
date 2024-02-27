import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import ProfilePhoto from '../../assets/profile_photo.jpg'
import {TG_ICON, EURO_ICON, VIEW_CONFIG, token} from '../../env/env'
import {Context} from '../../context/WebProvider'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import Loading from '../UI/Loading'
import {ModernAlert} from '../UI/ModernAlert'
import {getProfileM} from '../../graphql/pages/ProfilePageQueries'
import {manageProfileTreasureM} from '../../graphql/profile/ProfileQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Profile: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [image, setImage] = useState<string>('')
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [profile, setProfile] = useState<any | null>(null)
    const [treasures, setTreasures] = useState<any[]>([])
    const [treasure, setTreasure] = useState<any | null>(null)

    const centum = new Centum()

    const [getProfile] = useMutation(getProfileM, {
        onCompleted(data) {
            setProfile(data.getProfile)
        }
    })

    const [manageProfileTreasure] = useMutation(manageProfileTreasureM, {
        onCompleted(data) {
            ModernAlert(data.manageProfileTreasure)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getProfile({
                variables: {
                    account_id: id
                }
            })     
        }
    }, [context.account_id])

    useMemo(() => {
        if (profile !== null) {
            setCords(profile.cords)
            setImage(profile.main_photo === '' ? ProfilePhoto : profile.main_photo)       
        }
    }, [profile])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    const onView = () => {
        centum.go(profile.telegram, 'telegram')
    }

    const onLikeTreasure = () => {
        manageProfileTreasure({
            variables: {
                account_id: id, option: 'like', title: '', category: '', century: '', image: '', coll_id: treasure.shortid
            }
        })
    }

    return (
        <>          
            {profile !== null && profile.account_id !== context.account_id &&
                <>
                    <ImageLook src={image} max={17} className='photo_item' alt='account photo' />
                    <h2>Name: {profile.username}</h2>
                    <h4 className='pale'>Support {profile.goal} for <b>{profile.budget}{EURO_ICON}</b>/month</h4>

                    <ImageLook onClick={onView} src={TG_ICON} min={2} max={2} className='icon' alt='icon' />

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL>

                    {treasure === null ? 
                            <>
                                <DataPagination initialItems={profile.treasures} setItems={setTreasures} label='Collection of Treasures:' />
                                <div className='items half'>
                                    {treasures.map(el => 
                                        <div onClick={() => setTreasure(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                            <p>{el.likes} likes</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setTreasure(null)} />

                                {treasure.image === '' ? 
                                        <p>Sorry, image is not upload</p>
                                    :
                                        <ImageLook src={treasure.image} min={16} max={16} className='photo_item' alt='treasure photo' />
                                }

                                <h2>{treasure.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Type: {treasure.category}</h4>
                                    <h4 className='pale'>Century: {treasure.century}</h4>
                                </div>

                                <button onClick={onLikeTreasure}>Like</button>
                            </>
                    }
                </>
            }
            {profile === null && <Loading />}
        </>
    )
}

export default Profile