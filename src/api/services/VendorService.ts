import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { VendorRepository } from '../repositories/VendorRepository';

@Service()
export class VendorService {

    constructor(@OrmRepository() private repo: VendorRepository
    ) { }

    public findOne(vendor: any): Promise<any> {
        return this.repo.findOne(vendor);
    }

    public update(vendor: any): Promise<any> {
        return this.repo.save(vendor);
    }

    public setCouriersPreferences(id: number, preferences: string[]) {
        console.log(preferences)
        return this.repo.update({ userId: id }, {
            courier1: preferences[0].trim(),
            courier2: preferences[1].trim(),
            courier3: preferences[2].trim(),
            courier4: preferences[3].trim()
        });
    }

    public setSameDayActive(vendorId, toggle: 0 | 1) {
        return this.repo.update({ userId: vendorId }, { sameDayActive: toggle })
    }

    public setOpenBoxActive(vendorId, toggle: 0 | 1) {
        return this.repo.update({ userId: vendorId }, { openBoxActive: toggle })
    }

}
