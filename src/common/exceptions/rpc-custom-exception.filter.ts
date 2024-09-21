import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter{

  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const respose = ctx.getResponse();

    const rpcError = exception.getError();

    if(typeof rpcError ==='object' && 'status' in rpcError && 'message' in rpcError){
      const status = isNaN(+rpcError.status)? 400: +rpcError.status;
      return respose.status(status).json(rpcError);
    }

    respose.status(400).json({
      status:400,
      message:rpcError,
    })


  }
}