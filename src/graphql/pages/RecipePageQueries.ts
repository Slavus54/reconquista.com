import {gql} from '@apollo/client'

export const createRecipeM = gql`
    mutation createRecipe($username: String!, $id: String!, $title: String!, $cuisine: String!, $category: String!, $level: String!, $ingredients: [IngredientInp]!, $url: String!, $calories: Float!) {
        createRecipe(username: $username, id: $id, title: $title, cuisine: $cuisine, category: $category, level: $level, ingredients: $ingredients, url: $url, calories: $calories)
    }
`

export const getRecipesQ = gql`
    query {
        getRecipes {
            shortid
            username
            title
            cuisine
            category
            level
            ingredients {
                id
                label
                measure
                volume
            }
            url
            calories
            steps {
                shortid
                name
                text
                ingredient
                stage
                duration
            }
            cookings {
                shortid
                name
                title
                receiver
                image
                dateUp
                likes
            }
        }
    }
`

export const getRecipeM = gql`
    mutation getRecipe($shortid: String!) {
        getRecipe(shortid: $shortid) {
            shortid
            username
            title
            cuisine
            category
            level
            ingredients {
                id
                label
                measure
                volume
            }
            url
            calories
            steps {
                shortid
                name
                text
                ingredient
                stage
                duration
            }
            cookings {
                shortid
                name
                title
                receiver
                image
                dateUp
                likes
            }
        }
    }
`

export const makeRecipeStepM = gql`
    mutation makeRecipeStep($username: String!, $id: String!, $text: String!, $ingredient: String!, $stage: String!, $duration: Float!) {
        makeRecipeStep(username: $username, id: $id, text: $text, ingredient: $ingredient, stage: $stage, duration: $duration)
    }
`

export const updateRecipeInfoM = gql`
    mutation updateRecipeInfo($username: String!, $id: String!, $url: String!, $calories: Float!) {
        updateRecipeInfo(username: $username, id: $id, url: $url, calories: $calories)
    }
`

export const manageRecipeCookingM = gql`
    mutation manageRecipeCooking($username: String!, $id: String!, $option: String!, $title: String!, $receiver: String!, $image: String!, $dateUp: String!, $coll_id: String!) {
        manageRecipeCooking(username: $username, id: $id, option: $option, title: $title, receiver: $receiver, image: $image, dateUp: $dateUp, coll_id: $coll_id)
    }
`