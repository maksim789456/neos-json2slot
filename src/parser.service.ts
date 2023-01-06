import { Injectable } from '@nestjs/common/decorators/core';
import { v4 } from 'uuid';

@Injectable()
export class ParserService {
  jsonToSlots(obj, uuid) {
    const tmp = this.getSlot(uuid);
    this.iterate(obj, tmp);
    const result = { Object: tmp, TypeVersions: {} };
    // console.log(JSON.stringify(result));
    return result;
  }

  iterate(obj, slot) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        const tmp = this.getSlot(key);
        slot.Children.push(tmp);
        this.iterate(obj[key], tmp);
      } else {
        slot.Children.push(this.getSlot(key, obj[key].toString()));
      }
    }
  }

  slotTemplate = {
    ID: 'cb50b937-4237-49f5-9c80-7a59183eefcd',
    Name: {
      ID: '6dd9cda4-1be1-40b7-82d1-6d9e708439d5',
      Data: 'EmptyObject',
    },
    Tag: {
      ID: '36c64ebd-a1be-4bac-9600-ca1192ee21d7',
      Data: null,
    },
    Active: {
      ID: '51095910-3110-4501-9865-b145c2695f84',
      Data: false,
    },
    Children: [],
  };

  getSlot(name, tag = null) {
    //var tmp = Object.assign({}, slotTemplate);
    //var tmp = {...slotTemplate};
    const tmp = JSON.parse(JSON.stringify(this.slotTemplate));
    // setup guids
    tmp.ID = v4();
    tmp.Name.ID = v4();
    tmp.Tag.ID = v4();
    tmp.Active.ID = v4();

    tmp.Name.Data = name;
    if (tag != null) tmp.Tag.Data = tag;

    return tmp;
  }
}
