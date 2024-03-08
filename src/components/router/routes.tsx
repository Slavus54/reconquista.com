import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import CreateIndividual from '../pages/CreateIndividual'
import Individuals from '../pages/Individuals'
import Individual from '../pages/Individual'
import CreateRaid from '../pages/CreateRaid'
import Raids from '../pages/Raids'
import Raid from '../pages/Raid'
import CreateStory from '../pages/CreateStory'
import Stories from '../pages/Stories'
import Story from '../pages/Story'
import CreateLaw from '../pages/CreateLaw'
import Laws from '../pages/Laws'
import Law from '../pages/Law'
import CreateLand from '../pages/CreateLand'
import Lands from '../pages/Lands'
import Land from '../pages/Land'
import CreateRecipe from '../pages/CreateRecipe'
import Recipes from '../pages/Recipes'
import Recipe from '../pages/Recipe'
import Profiles from '../pages/Profiles'
import Profile from '../pages/Profile'

import {RouteType} from '../../types/types'

export const routes: RouteType[] = [
    {
        title: 'Home',
        access_value: 0,
        url: '/',
        component: Home,
        isVisible: true
    },
    {
        title: 'Account',
        access_value: -1,
        url: '/login',
        component: Login,
        isVisible: true
    },
    {
        title: 'Individuals',
        access_value: 1,
        url: '/individuals',
        component: Individuals,
        isVisible: true
    },
    {
        title: 'Lands',
        access_value: 1,
        url: '/lands',
        component: Lands,
        isVisible: true
    },
    {
        title: 'Recipes',
        access_value: 1,
        url: '/recipes',
        component: Recipes,
        isVisible: true
    },
    {
        title: 'Raids',
        access_value: 1,
        url: '/raids',
        component: Raids,
        isVisible: true
    },
    {
        title: 'Laws',
        access_value: 1,
        url: '/laws',
        component: Laws,
        isVisible: true
    },
    {
        title: 'Stories',
        access_value: 1,
        url: '/stories',
        component: Stories,
        isVisible: true
    },
    {
        title: 'Profiles',
        access_value: 1,
        url: '/profiles',
        component: Profiles,
        isVisible: true
    },
    {
        title: '',
        access_value: -1,
        url: '/register',
        component: Register,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-individual/:id',
        component: CreateIndividual,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/individual/:id',
        component: Individual,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-raid/:id',
        component: CreateRaid,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/raid/:id',
        component: Raid,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-story/:id',
        component: CreateStory,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/story/:id',
        component: Story,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-law/:id',
        component: CreateLaw,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/law/:id',
        component: Law,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-land/:id',
        component: CreateLand,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/land/:id',
        component: Land,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-recipe/:id',
        component: CreateRecipe,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/recipe/:id',
        component: Recipe,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/profile/:id',
        component: Profile,
        isVisible: false
    },
]