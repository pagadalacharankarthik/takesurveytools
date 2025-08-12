// Client-side file parsing utilities
export interface ParsedContent {
  text: string
  fileName: string
  fileType: string
}

export const parseTextFile = async (file: File): Promise<ParsedContent> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      resolve({
        text,
        fileName: file.name,
        fileType: "text",
      })
    }
    reader.onerror = () => reject(new Error("Failed to read text file"))
    reader.readAsText(file)
  })
}

// For demo purposes, we'll simulate PDF parsing
export const parsePDFFile = async (file: File): Promise<ParsedContent> => {
  // In a real implementation, you'd use pdf.js here
  // For demo, we'll return sample content based on filename
  const fileName = file.name.toLowerCase()

  let sampleText = ""
  if (fileName.includes("water")) {
    sampleText = `
    Water Access and Quality Assessment Report
    
    This document outlines the methodology for assessing water access and quality in rural communities.
    Key areas of focus include:
    - Primary water sources and their reliability
    - Water quality testing and treatment methods
    - Distance and time required for water collection
    - Infrastructure needs and improvements
    - Community health impacts related to water access
    
    The survey should capture data on household water usage patterns, seasonal variations in water availability,
    and community preferences for water infrastructure improvements.
    `
  } else if (fileName.includes("health")) {
    sampleText = `
    Community Health Assessment Guidelines
    
    This document provides a framework for conducting comprehensive health surveys in underserved communities.
    Focus areas include:
    - General health status and common health challenges
    - Access to healthcare facilities and services
    - Preventive care and health education needs
    - Maternal and child health indicators
    - Environmental health factors
    
    The assessment should gather information on healthcare utilization patterns, barriers to accessing care,
    and community health priorities for intervention planning.
    `
  } else {
    sampleText = `
    Survey Document Content
    
    This document contains guidelines and methodology for conducting community surveys.
    Key topics covered include data collection methods, question design principles,
    and community engagement strategies. The survey should focus on gathering
    relevant demographic information and specific domain knowledge related to
    the community's needs and challenges.
    `
  }

  return {
    text: sampleText,
    fileName: file.name,
    fileType: "pdf",
  }
}

// For demo purposes, we'll simulate DOCX parsing
export const parseDOCXFile = async (file: File): Promise<ParsedContent> => {
  // In a real implementation, you'd use mammoth.js here
  // For demo, return sample content
  const sampleText = `
  Survey Template Document
  
  This template provides a structured approach to community data collection.
  The document includes sample questions and methodologies for:
  - Demographic data collection
  - Community needs assessment
  - Infrastructure evaluation
  - Social and economic indicators
  
  Please customize the questions based on your specific research objectives
  and community context.
  `

  return {
    text: sampleText,
    fileName: file.name,
    fileType: "docx",
  }
}

export const parseFile = async (file: File): Promise<ParsedContent> => {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  if (fileType === "text/plain" || fileName.endsWith(".txt")) {
    return parseTextFile(file)
  } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    return parsePDFFile(file)
  } else if (
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    return parseDOCXFile(file)
  } else {
    throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT files.")
  }
}
