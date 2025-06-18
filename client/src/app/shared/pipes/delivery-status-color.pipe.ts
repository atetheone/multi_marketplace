import { Pipe, PipeTransform } from '@angular/core';
import { DeliveryStatus } from '#core/types/delivery';

@Pipe({
  name: 'deliveryStatusColor',
})
export class DeliveryStatusColorPipe implements PipeTransform {
  transform(status: string): string {
    switch (status) {
      case DeliveryStatus.PENDING:
        return 'bg-gray-100 text-gray-800';
      case DeliveryStatus.ASSIGNED:
        return 'bg-blue-100 text-blue-800';
      case DeliveryStatus.SHIPPED:
        return 'bg-yellow-100 text-yellow-800';
      case DeliveryStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case DeliveryStatus.RETURNED:
        return 'bg-orange-100 text-orange-800';
      case DeliveryStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}