import { APIGatewayProxyEvent} from 'aws-lambda'
import { JwtPayload } from '../auth/JwtPayload'
import { decode } from 'jsonwebtoken'

export function getUserId(event: APIGatewayProxyEvent): string{
    const authHeader = event.headers.Authorization
    const jwtToken = getToken(authHeader)
    
    return jwtToken.sub
}

function getToken(authHeader: string): JwtPayload{

  const split = authHeader.split(' ')
  const token = split[1]
  
  return decode(token) as JwtPayload
  

  // request has been authrorized
}