export interface Course { 
    courseName : string;
    units : Unit[];
}

export interface Unit { 
    unitName : string;
    lessons : Lesson[];
}

export interface Lesson { 
    lessonName : string;
    questions : Question[];
    
}

export interface Question { 
    question : string;
    options : string[];
    answer : string;
}

export interface QuizResults { 
    courseName : string;
    lessonName : string;
    correctAnswers : number;
    totalQuestions : number;
    score : number;
}


type outputUnits = {
    title: string;
    chapters: {
      youtube_search_query: string;
      chapter_title: string;
    }[];
  }[];