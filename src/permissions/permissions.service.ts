import { Injectable } from '@nestjs/common';
import { LoggerService } from '@src/core/service/logger/logger.service';
import pdfPermission from '@src/generate-pdf/generate-pdf.enum';

@Injectable()
export class PermissionsService {
  private readonly permissions: any;

  constructor(private readonly logger: LoggerService) {
    this.permissions = this.processEnums([pdfPermission]);
  }

  private addPermissionToModule(
    permissionsByModule: any,
    module: string,
    permission: string
  ) {
    if (!permissionsByModule[module]) {
      permissionsByModule[module] = [];
    }
    permissionsByModule[module].push(permission);
  }

  private processEnums(enumArray: any[]): any {
    const permissionsByModule: any = {};

    enumArray.forEach(enumeration => {
      for (const key in enumeration) {
        if (Object.prototype.hasOwnProperty.call(enumeration, key)) {
          const permission = enumeration[key];
          if (typeof permission === 'string') {
            const [module] = permission.split('_');
            this.addPermissionToModule(permissionsByModule, module, permission);
          } else {
            this.logger.log('Invalid permission found:', permission);
          }
        }
      }
    });

    return permissionsByModule;
  }

  async findAll(): Promise<any> {
    try {
      this.logger.log('Starting to get all permissions', 'PermissionsService');

      const allEnums = [pdfPermission];
      const permissionsByModule = this.processEnums(allEnums);

      this.logger.log(
        'Successfully retrieved all permissions',
        permissionsByModule
      );

      return permissionsByModule;
    } catch (error) {
      this.logger.error(
        'Error while fetching permissions',
        'PermissionsService',
        error
      );
      throw new Error('Failed to fetch permissions');
    }
  }

  hasPermission(menu: any, action: string): boolean {
    for (const key in menu) {
      if (Object.prototype.hasOwnProperty.call(menu, key)) {
        const allowedActions = this.permissions[key];
        if (allowedActions && menu[key].includes(action)) {
          return true;
        }
      }
    }
    return false;
  }
}
