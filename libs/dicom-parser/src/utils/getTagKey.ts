import TagsDictionaryEnums from "../enums/TagsDictionary";

function getTagKey(group:number,element:number): {
    tagKey: string;
    tagName: string|null;
    vr: string|null;
}{
    const groupKey = `${group.toString(16).padStart(4,'0')}`.toUpperCase();
    const elementKey = `${element.toString(16).padStart(4,'0')}`.toUpperCase();
    let tagInfo:string[]|null[] = [null,null];
    
    if(TagsDictionaryEnums[groupKey] && TagsDictionaryEnums[groupKey][elementKey]){
        tagInfo = TagsDictionaryEnums[groupKey][elementKey] as string[];
    }
    
    return {
        tagKey:`(${groupKey},${elementKey})`,
        tagName: tagInfo[1],
        vr: tagInfo[0],
    }
    
}

export default getTagKey;