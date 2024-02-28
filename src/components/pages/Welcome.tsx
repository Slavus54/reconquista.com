import React from 'react'
import NavigatorWrapper from '../router/NavigatorWrapper'
import features from '../../env/features.json'

const Welcome: React.FC = () => {

    return (
        <>          
            <h1>Reconquista.com</h1>
            <h3 className='pale'>Let's save our Europe</h3>
            
            <NavigatorWrapper isRedirect={false} url='/register'>
                <button className='light'>Start</button>
            </NavigatorWrapper>

            <div className='items vert'>
                {features.map(el => 
                    <div className='item case'>
                        <h3>{el.title}</h3>
                        <p>{el.text}</p>
                    </div>    
                )}
            </div>
        </>
    )
}

export default Welcome