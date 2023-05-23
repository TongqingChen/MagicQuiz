export interface IArticle {
    id: number
    category: string
    title: string
    user: string
    user_avatar: string
    content: string
    create_time: string
    update_time: string
}

export class Article implements IArticle {
    id: number = -1
    category: string = ''
    title: string = ''
    user: string = ''
    user_avatar: string = ''
    content: string = ''
    create_time: string = ''
    update_time: string = ''
    copyFrom(other: IArticle) {
        this.id = other.id
        this.category = other.category
        this.title = other.title
        this.user = other.user
        this.user_avatar = other.user_avatar
        this.content = other.content
        this.create_time = other.create_time
        this.update_time = other.update_time
    }
}

export interface IArticles {
    category: string
    articles: IArticle[]
}