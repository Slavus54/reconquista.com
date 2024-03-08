import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {RECIPE_CALORIES_DEFAULT, STEP_STAGES, COOKING_RECEIVERS, INITIAL_PERCENT} from '../../env/env'
import {Context} from '../../context/WebProvider'
import DataPagination from '../UI/DataPagination'
import Loading from '../UI/Loading'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import {ModernAlert} from '../UI/ModernAlert'
import {getRecipeM, makeRecipeStepM, updateRecipeInfoM, manageRecipeCookingM} from '../../graphql/pages/RecipePageQueries'
import {CollectionPropsType} from '../../types/types'

const Recipe: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const datus = new Datus()

    const {context} = useContext<any>(Context)
    const [timer, setTimer] = useState<number>(0)
    const [image, setImage] = useState<string>('')
    const [recipe, setRecipe] = useState<any | null>(null)
    const [ingredients, setIngredients] = useState<any[]>([])
    const [cookings, setCookings] = useState<any[]>([])
    const [cooking, setCooking] = useState<any | null>(null)
    const [step, setStep] = useState<any | null>(null)
    const [state, setState] = useState({
        url: '',
        calories: RECIPE_CALORIES_DEFAULT,
        text: '',
        ingredient: '',
        stage: STEP_STAGES[0],
        duration: INITIAL_PERCENT,
        title: '',
        receiver: COOKING_RECEIVERS[0],
        dateUp: datus.move()
    })

    const centum = new Centum()

    const {url, calories, text, ingredient, stage, duration, title, receiver, dateUp} = state

    const [getRecipe] = useMutation(getRecipeM, {
        onCompleted(data) {
            setRecipe(data.getRecipe)
        }
    })

    const [makeRecipeStep] = useMutation(makeRecipeStepM, {
        onCompleted(data) {
            ModernAlert(data.makeRecipeStep)
        }
    })

    const [updateRecipeInfo] = useMutation(updateRecipeInfoM, {
        onCompleted(data) {
            ModernAlert(data.updateRecipeInfo)
        }
    })

    const [manageRecipeCooking] = useMutation(manageRecipeCookingM, {
        onCompleted(data) {
            ModernAlert(data.manageRecipeCooking)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getRecipe({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (recipe !== null) {
            setState({...state, url: recipe.url, calories: recipe.calories})
        }
    }, [recipe])

    const onStep = () => {
        if (step === null) {
            let result = centum.random(recipe.steps)?.value

            if (result !== undefined) {
                setStep(result)
            }
        } else {

            setTimer(timer + step.duration)
            
            setStep(null)
        }
    }

    const onMakeStep = () => {
        makeRecipeStep({
            variables: {
                username: context.username, id, text, ingredient, stage, duration 
            }
        })
    }

    const onUpdateInfo = () => {
        updateRecipeInfo({
            variables: {
                username: context.username, id, url, calories
            }
        })
    }

    const onManageCooking = (option: string) => {
        manageRecipeCooking({
            variables: {
                username: context.username, id, option, title, receiver, image, dateUp, coll_id: cooking === null ? '' : cooking.shortid
            }
        })
    }

    return (
        <>          
            {recipe !== null &&
                <>
                    <h2>{recipe.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Cuisine: {recipe.cuisine}</h4>
                        <h4 className='pale'>Type: {recipe.category}</h4>
                    </div>

                    <h2>Calories and Link</h2>

                    <div className='items small'>
                        <input value={calories} onChange={e => setState({...state, calories: parseInt(e.target.value)})} placeholder='Calories per 100g' type='text' />
                        <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' />
                    </div>

                    {isNaN(calories) ? 
                            <button onClick={() => setState({...state, calories: RECIPE_CALORIES_DEFAULT})}>Reset</button>
                        :
                            <button onClick={onUpdateInfo}>Update</button>
                    }

                    {step === null ? 
                            <>
                                <h2>New Step</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Content of step...' />

                                <DataPagination initialItems={recipe.ingredients} setItems={setIngredients} label='List of ingredients:' />
                                <div className='items half'>
                                    {ingredients.map(el => 
                                        <div onClick={() => setState({...state, ingredient: el.label})} className='item panel'>
                                            {centum.shorter(el.label)}
                                            <p><b>{el.volume}</b> {el.measure}</p>
                                        </div>    
                                    )}
                                </div>

                                <select value={stage} onChange={e => setState({...state, stage: e.target.value})}>
                                    {STEP_STAGES.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <h4 className='pale'>Duration: <b>{duration}</b> minutes</h4>
                                <input value={duration} onChange={e => setState({...state, duration: parseInt(e.target.value)})} type='range' step={1} />

                                <button onClick={onMakeStep}>Create</button>

                                <h2>Steps Constructor</h2>
                                <h4 className='pale'>Total: {datus.time(timer)}</h4>
                                <button onClick={onStep} className='light'>Generate</button>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setStep(null)} />

                                <p>Content: {step.text}</p>
                                <h4 className='pale'>Ingredient: {step.ingredient}</h4>

                                <div className='items small'>
                                    <h5>Stage: {step.stage}</h5>
                                    <h5>Duration: <b>{step.duration}</b> minutes</h5>
                                </div>

                                <button onClick={onStep} className='light'>+</button>
                            </>
                    }

                    {cooking === null ? 
                            <>
                                <h2>New Cooking</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Describe it...' />

                                <h4 className='pale'>Receiver</h4>
                                <div className='items small'>
                                    {COOKING_RECEIVERS.map(el => <div onClick={() => setState({...state, receiver: el})} className={el === receiver ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageCooking('create')}>Publish</button>

                                <DataPagination initialItems={recipe.cookings} setItems={setCookings} label='Collections of cookings:' />
                                <div className='items half'>
                                    {cookings.map(el => 
                                        <div onClick={() => setCooking(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setCooking(null)} />

                                {cooking.image !== '' && <ImageLook src={cooking.image} className='photo_item' alt='coking photo' />}
                                
                                <p>{cooking.title} from {cooking.name}</p>

                                <div className='items small'>       
                                    <h4 className='pale'>Receiver: {cooking.receiver}</h4>
                                    <h4 className='pale'><b>{cooking.likes}</b> likes</h4>
                                </div>

                                {cooking.name === context.username ? 
                                        <button onClick={() => onManageCooking('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageCooking('like')}>Like</button>
                                }
                            </>     
                    }
                </>
            }

            {recipe === null && <Loading />}
        </>
    )
}

export default Recipe