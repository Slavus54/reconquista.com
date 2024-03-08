import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useQuery} from '@apollo/client'
import Centum from 'centum.js'
import {RECIPE_TYPES, COMMON_LEVELS, SEARCH_PERCENT, PROJECT_TITLE} from '../../env/env'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import DataPagination from '../UI/DataPagination'
import Loading from '../UI/Loading'
import {getRecipesQ} from '../../graphql/pages/RecipePageQueries'

const Recipes: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(RECIPE_TYPES[0])
    const [level, setLevel] = useState<string>(COMMON_LEVELS[0])
    const [recipes, setRecipes] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const {data, loading} = useQuery(getRecipesQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setRecipes(data.getRecipes)

            centum.title('Recipes', PROJECT_TITLE)
            centum.favicon('favicon-recipe')
        }
    }, [data])

    useMemo(() => {
        if (recipes !== null) {
            let result: any[] = recipes.filter(el => el.category === category)

            if (title !== '') {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT, true))
            }

            result = result.filter(el => el.level === level)

            setFiltered(result)
        }   
    }, [recipes, title, category, level])

    return (
        <>          
            <h1>Try to cooking</h1>
        
            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Title of recipe' />

            <h4 className='pale'>Type and Difficulty</h4>
            <div className='items small'>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    {RECIPE_TYPES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={level} onChange={e => setLevel(e.target.value)}>
                    {COMMON_LEVELS.map(el => <option value={el}>{el}</option>)}
                </select>
            </div>  

            <DataPagination initialItems={filtered} setItems={setFiltered} label='List of recipes:' />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <NavigatorWrapper url={`/recipe/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.title)}
                            </NavigatorWrapper>
                        </div>
                    )}
                </div> 
            }
            {loading && <Loading />}
        </>
    )
}

export default Recipes