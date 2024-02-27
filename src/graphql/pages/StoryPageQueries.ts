import {gql} from '@apollo/client'

export const createStoryM = gql`
    mutation createStory($username: String!, $id: String!, $title: String!, $category: String!, $religion: String!, $status: String!, $chapters: [IChapter]!, $region: String!, $cords: ICord!, $goal: String!, $card: String!) {
        createStory(username: $username, id: $id, title: $title, category: $category, religion: $religion, status: $status, chapters: $chapters, region: $region, cords: $cords, goal: $goal, card: $card)
    }
`

export const getStoriesQ = gql`
    query {
        getStories {
            shortid
            username
            title
            category
            religion
            status
            chapters {
                content
                format
                image
            }
            region
            cords {
                lat
                long
            }
            goal
            card
            questions {
                shortid
                name
                text
                category
                reply
                answered
                likes
            }
            sharings {
                shortid
                name
                position
                rating
                dateUp
            }
        }
    }
`

export const getStoryM = gql`
    mutation getStory($shortid: String!) {
        getStory(shortid: $shortid) {
            shortid
            username
            title
            category
            religion
            status
            chapters {
                content
                format
                image
            }
            region
            cords {
                lat
                long
            }
            goal
            card
            questions {
                shortid
                name
                text
                category
                reply
                answered
                likes
            }
            sharings {
                shortid
                name
                position
                rating
                dateUp
            }
        }
    }
`

export const makeStoryChapterM = gql`
    mutation makeStoryChapter($username: String!, $id: String!, $content: String!, $format: String!, $image: String!) {
        makeStoryChapter(username: $username, id: $id, content: $content, format: $format, image: $image) 
    }
`

export const manageStoryQuestionM = gql`
    mutation manageStoryQuestion($username: String!, $id: String!, $option: String!, $text: String!, $category: String!, $coll_id: String!, $reply: String!) {
        manageStoryQuestion(username: $username, id: $id, option: $option, text: $text, category: $category, coll_id: $coll_id, reply: $reply)
    }
`

export const updateStoryInfoM = gql`
    mutation updateStoryInfo($username: String!, $id: String!, $goal: String!, $card: String!) {
        updateStoryInfo(username: $username, id: $id, goal: $goal, card: $card)
    }
`

export const makeStorySharingM = gql`
    mutation makeStorySharing($username: String!, $id: String!, $position: String!, $rating: Float!, $dateUp: String!) {
        makeStorySharing(username: $username, id: $id, position: $position, rating: $rating, dateUp: $dateUp)
    }
`