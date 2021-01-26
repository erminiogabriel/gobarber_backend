import IParseMailTemplateDTO from '../dtos/IParseMailTempleateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
