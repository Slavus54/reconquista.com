import PersonalProfileInfo from './PersonalProfileInfo'
import GeoProfileInfo from './GeoProfileInfo'
import CommonProfileInfo from './CommonProfileInfo'
import ProfileSecurity from './ProfileSecurity'
import ProfileTreasures from './ProfileTreasures'
import ProfileComponents from './ProfileComponents'

import {AccountPageComponentType} from '../../types/types'

const components: AccountPageComponentType[] = [
    {
        title: 'Account',
        icon: './profile/account.png',
        component: PersonalProfileInfo
    },
    {
        title: 'Location',
        icon: './profile/geo.png',
        component: GeoProfileInfo
    },
    {
        title: 'Charity',
        icon: './profile/charity.png',
        component: CommonProfileInfo
    },
    {
        title: 'Security',
        icon: './profile/security.png',
        component: ProfileSecurity
    },
    {
        title: 'Treasures',
        icon: './profile/treasure.png',
        component: ProfileTreasures
    },
    {
        title: 'Collections',
        icon: './profile/collections.png',
        component: ProfileComponents
    }
]

export const default_component = components[0]

export default components