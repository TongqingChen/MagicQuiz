export interface IArticle {
    id: number
    category: string
    title: string
    user: string
    user_avatar: string
    content: string
    attachment: string
    attach_type: number
    create_time: string
    update_time: string
}
const FileTypes: string[] = ['docx', 'pdf']

export class Article implements IArticle {
    id: number = -1
    category: string = ''
    title: string = ''
    user: string = ''
    user_avatar: string = ''
    content: string = ''
    attachment: string = ''
    attach_type: number = -1
    create_time: string = ''
    update_time: string = ''
    copyFrom(other: IArticle) {
        this.id = other.id
        this.category = other.category
        this.title = other.title
        this.user = other.user
        this.user_avatar = other.user_avatar
        this.content = other.content
        this.attachment = other.attachment
        this.attach_type = -1
        if (this.attachment && this.attachment.length > 0) {
            var types = this.attachment.split('.')
            this.attach_type = FileTypes.indexOf(types[types.length - 1])
        }
        this.create_time = other.create_time
        this.update_time = other.update_time
    }
}

export interface IArticles {
    category: string
    articles: IArticle[]
}