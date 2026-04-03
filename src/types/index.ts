// Manually typed serialized shapes — dates are ISO strings after adapter conversion.
// These match what components receive as props.

export type SerializedProject = {
  id:            string
  title:         string
  slug:          string
  excerpt:       string
  content:       unknown
  category:      string
  coverImageUrl: string
  images:        string[]
  tools:         string[]
  featured:      boolean
  published:     boolean
  publishedAt:   string | null
  createdAt:     string
  updatedAt:     string
  metadata: {
    ogTitle:       string
    ogDescription: string
    ogImage:       string
  }
}

export type SerializedThought = {
  id:            string
  title:         string
  slug:          string
  excerpt:       string
  content:       unknown
  coverImageUrl: string
  readTime:      number
  published:     boolean
  publishedAt:   string | null
  createdAt:     string
  updatedAt:     string
  metadata: {
    ogTitle:       string
    ogDescription: string
    ogImage:       string
  }
}

export type SerializedProfile = {
  id:                string
  name:              string
  title:             string
  bio:               string
  avatarUrl:         string
  yearsOfExperience: number
  projectsCompleted: number
  worldwideClients:  number
  createdAt:         string
  updatedAt:         string
  socialLinks: {
    dribbble:  string
    twitter:   string
    instagram: string
    email:     string
    youtube:   string
  }
}

export type SerializedTool = {
  id:          string
  name:        string
  description: string
  logoUrl:     string
  externalUrl: string
  category:    string
  order:       number
  createdAt:   string
  updatedAt:   string
}

export type SerializedCertification = {
  id:            string
  name:          string
  issuer:        string
  year:          number
  credentialUrl: string
  badgeImageUrl: string
  order:         number
  createdAt:     string
  updatedAt:     string
}

export type SerializedContactMessage = {
  id:        string
  name:      string
  email:     string
  budget:    string
  message:   string
  createdAt: string
  updatedAt: string
}
