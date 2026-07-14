-- ============================================================
-- AlgoVision -- Initial Database Schema
-- Migration: V1__create_initial_schema.sql
-- ============================================================

CREATE TABLE users (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'USER'
                  CHECK (role IN ('USER', 'ADMIN')),
    theme_pref    VARCHAR(10)  NOT NULL DEFAULT 'dark'
                  CHECK (theme_pref IN ('dark', 'light')),
    email_verified BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email    ON users(email);
CREATE INDEX idx_users_username ON users(username);

CREATE TABLE topics (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    slug             VARCHAR(100) NOT NULL UNIQUE,
    name             VARCHAR(150) NOT NULL,
    category         VARCHAR(50)  NOT NULL
                     CHECK (category IN (
                         'SORTING', 'SEARCHING', 'TREES', 'GRAPHS',
                         'DYNAMIC_PROGRAMMING', 'GREEDY', 'BACKTRACKING',
                         'STRING_MATCHING', 'DATA_STRUCTURES'
                     )),
    difficulty       VARCHAR(20)  NOT NULL
                     CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    description      TEXT,
    time_complexity  JSONB,
    space_complexity VARCHAR(50),
    pseudocode       TEXT,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_topics_category   ON topics(category);
CREATE INDEX idx_topics_difficulty ON topics(difficulty);
CREATE INDEX idx_topics_slug       ON topics(slug);

CREATE TABLE topic_code_samples (
    id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id  UUID        NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    language  VARCHAR(20) NOT NULL
              CHECK (language IN ('JAVA', 'CPP', 'PYTHON', 'JAVASCRIPT')),
    code      TEXT        NOT NULL,
    UNIQUE (topic_id, language)
);

CREATE INDEX idx_code_samples_topic ON topic_code_samples(topic_id);

CREATE TABLE user_progress (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id     UUID        NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    status       VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED'
                 CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')),
    completed_at TIMESTAMPTZ,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, topic_id)
);

CREATE INDEX idx_user_progress_user  ON user_progress(user_id);
CREATE INDEX idx_user_progress_topic ON user_progress(topic_id);

CREATE TABLE bookmarks (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id   UUID        NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, topic_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);

CREATE TABLE quiz_questions (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id      UUID        REFERENCES topics(id) ON DELETE SET NULL,
    question      TEXT        NOT NULL,
    options       JSONB       NOT NULL,
    correct_index SMALLINT    NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
    explanation   TEXT,
    difficulty    VARCHAR(20) NOT NULL CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    created_by    UUID        REFERENCES users(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quiz_questions_topic      ON quiz_questions(topic_id);
CREATE INDEX idx_quiz_questions_difficulty ON quiz_questions(difficulty);

CREATE TABLE quiz_attempts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mode            VARCHAR(20) NOT NULL CHECK (mode IN ('PRACTICE', 'INTERVIEW')),
    score           INTEGER     NOT NULL DEFAULT 0,
    total_questions INTEGER     NOT NULL,
    duration_sec    INTEGER,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at     TIMESTAMPTZ
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);

CREATE TABLE quiz_attempt_answers (
    id             UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id     UUID     NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id    UUID     NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    selected_index SMALLINT,
    is_correct     BOOLEAN  NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_attempt_answers_attempt ON quiz_attempt_answers(attempt_id);

CREATE TABLE code_submissions (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id     UUID        REFERENCES topics(id) ON DELETE SET NULL,
    language     VARCHAR(20) NOT NULL CHECK (language IN ('JAVA', 'CPP', 'PYTHON', 'JAVASCRIPT')),
    source_code  TEXT        NOT NULL,
    verdict      VARCHAR(20) CHECK (verdict IN (
                     'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED',
                     'RUNTIME_ERROR', 'COMPILATION_ERROR'
                 )),
    runtime_ms   INTEGER,
    memory_kb    INTEGER,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_submissions_user  ON code_submissions(user_id);
CREATE INDEX idx_submissions_topic ON code_submissions(topic_id);

CREATE TABLE performance_runs (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        REFERENCES users(id) ON DELETE SET NULL,
    algorithms  JSONB       NOT NULL,
    input_sizes JSONB       NOT NULL,
    results     JSONB       NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_performance_runs_user ON performance_runs(user_id);