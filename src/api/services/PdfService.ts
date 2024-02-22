import { Service } from 'typedi';
import * as path from 'path';
import ejs = require('ejs');
import moment from 'moment';

@Service()
export class PdfService {

  public createPDFFile(htmlString: any, isDownload: boolean = false, reportGeneratedBy: string = ''): Promise<any> {
    const pdf = require('html-pdf');
    console.log(path.join(process.cwd(), 'uploads'));
    const directoryPath = path.join(process.cwd(), 'uploads');
    const options = {
      format: 'A4',
      orientation: 'portrait',
      base: directoryPath,
      margin: { top: '0mm', left: '5mm', bottom: '-5mm', right: '5mm' },
      timeout: 60000,
      zoomFactor: '0.5',
      quality: '100',
      phantomArgs: ['--web-security=no', '--local-url-access=false'],
      footer: {
        height: '28mm',
        contents: {
          default:
            '<p style="margin-left: 10px;color: #000;;margin-top:0;font-size: 0.50rem;">This is a system generated invoice and needs no signature. Jurisdiction in case of disputes be limited to the state from which the product is shipped. Maximum liability is restricted to selling price collected from the customer</p>',
        },
      },
    };
    /**
     * It will create PDF of that HTML into given folder.
     */
    return new Promise((resolve, reject) => {
      pdf.create(htmlString, options).toBuffer((err, buffer) => {
        if (err) {
          return reject(err);
        }
        if (isDownload) {
          resolve('data:application/pdf;base64,' + buffer.toString('base64'));
        }
        return resolve(buffer);
      });
    });
  }

  public orderInvoice(order: any): Promise<any> {
    return new Promise((resolve, reject) => {
      ejs.renderFile('./views/orderInvoice.ejs', { order, moment }, (err: any, data: any) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  public orderReturnLable(order: any, suborder: any): Promise<any> {
    return new Promise((resolve, reject) => {
      ejs.renderFile('./views/returnLable.ejs', { order, suborder, moment }, (err: any, data: any) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

}
