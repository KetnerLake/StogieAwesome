import OpenAI from 'openai';
import {z} from 'zod';
import {zodResponseFormat} from 'openai/helpers/zod';

export default async ( request, context ) => {
  try {
    const openai = new OpenAI( {apiKey: process.env.OPENAI_API_KEY} );

    const CigarRecommendationExtraction = z.object( {
      recommendations: z.array(  
        z.object( {
          name: z.string(),
          description: z.string(),
          body: z.string(),
          length: z.string(),
          gauge: z.string(),
          price: z.string(),
          country: z.string(),
          wrapper: z.string()
        } )
      )
    } );

    const completion = await openai.beta.chat.completions.parse( {
      model: 'gpt-4.1-mini',
      messages: [
        {role: 'system', content: 'You are a cigar expert. You will be given a question about cigars and should reply in the given structure.'},
        {role: 'user', content: 'Recommend five cigars for the beginner.'}
      ],
      response_format: zodResponseFormat( CigarRecommendationExtraction, 'cigar_recommendation_extraction' )
    } );

    const data = completion.choices[0].message.parsed;
    return new Response( JSON.stringify( data ) );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500,
    } );
  }
};

export const config = {
  path: '/api/novice'
};
