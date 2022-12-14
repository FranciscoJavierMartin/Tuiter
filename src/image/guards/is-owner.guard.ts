import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ImageRepository } from '@/image/repositories/image.repository';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private readonly imageRepository: ImageRepository) {}

  /**
   * Check if current user is image's owner
   * @param context Execution context
   * @returns True if current user is image's owner, false otherwise
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const image = await this.imageRepository.getImageById(
      request.params.imageId,
    );

    if (!image) {
      throw new NotFoundException(
        `Image with ID ${request.params.imageId} is not found`,
      );
    }

    return request.user.userId === image.ownerId.toString();
  }
}
