import React, {useState, useMemo, useContext} from 'react'
import {useMutation} from '@apollo/client'
import uniqid from 'uniqid'
import {CUISINES, RECIPE_TYPES, COMMON_LEVELS, INGREDIENT_MEASURES, RECIPE_CALORIES_DEFAULT, INITIAL_PERCENT, COLLECTION_LIMIT} from '../../env/env'
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import FormPagination from '../UI/FormPagination'
import {ModernAlert} from '../UI/ModernAlert'
import {createRecipeM} from '../../graphql/pages/RecipePageQueries'
import {CollectionPropsType} from '../../types/types'

const CreateRecipe: React.FC<CollectionPropsType> = ({params}) => {
    const {context} = useContext<any>(Context)
    const [idx, setIdx] = useState<number>(0)

    const [ingredient, setIngredient] = useState({
        id: uniqid(),
        label: '',
        measure: INGREDIENT_MEASURES[0],
        volume: INITIAL_PERCENT
    })
    const [state, setState] = useState({
        title: '', 
        cuisine: CUISINES[0], 
        category: RECIPE_TYPES[0], 
        level: COMMON_LEVELS[0], 
        ingredients: [], 
        url: '', 
        calories: RECIPE_CALORIES_DEFAULT
    })

    const centum = new Centum()

    const {title, cuisine, category, level, ingredients, url, calories} = state
    const {id, label, measure, volume} = ingredient

    const [createRecipe] = useMutation(createRecipeM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.createRecipe)
        }
    })

    const onIngredient = () => {
        if (ingredients.length < COLLECTION_LIMIT) {
            setState({...state, ingredients: [...ingredients, ingredient]})
        }

        setIngredient({
            id: uniqid(),
            label: '',
            measure: INGREDIENT_MEASURES[0],
            volume: INITIAL_PERCENT
        })
    }

    const onCreate = () => {
        createRecipe({
            variables: {
                username: context.username, id: params.id, title, cuisine, category, level, ingredients, url, calories
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Title</h4>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder={`Title of ${category}`} />
                
                        <h4 className='pale'>Cuisine</h4>
                        <div className='items small'>
                            {CUISINES.map(el => <div onClick={() => setState({...state, cuisine: el})} className={el === cuisine ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>
                       
                        <h4 className='pale'>Type and Difficulty</h4>
                        <div className='items small'>
                            <select value={category} onChange={e => setState({...state, category: e.target.value})}>
                                {RECIPE_TYPES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                {COMMON_LEVELS.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>                
                    </>,
                    <>
                        <h4 className='pale'>Ingredients ({ingredients.length}/{COLLECTION_LIMIT})</h4>
                        <textarea value={label} onChange={e => setIngredient({...ingredient, label: e.target.value})} placeholder='Title' />
                        
                        <div className='items small'>
                            {INGREDIENT_MEASURES.map(el => <div onClick={() => setIngredient({...ingredient, measure: el})} className={el === measure ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <h4 className='pale'>Volume: <b>{volume}</b> {measure}</h4>
                        <input value={volume} onChange={e => setIngredient({...ingredient, volume: parseInt(e.target.value)})} type='range' step={1} />

                        <button onClick={onIngredient}>+</button>

                        <h4 className='pale'>Calories per 100g and Link</h4>
                        <div className='items small'>
                            <input value={calories} onChange={e => setState({...state, calories: parseInt(e.target.value)})} placeholder='Calories per 100g' type='text' />
                            <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />
                        </div>

                        {isNaN(calories) ? 
                                <button onClick={() => setState({...state, calories: RECIPE_CALORIES_DEFAULT})}>Reset</button>
                            :
                                <button onClick={onCreate}>Create</button>
                        }
                    </>
                ]} 
            >
                <h2>New Recipe</h2>
            </FormPagination>     
        </div>
    )
}

export default CreateRecipe