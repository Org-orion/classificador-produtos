export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      adailton2_0_acesso_usuario_empresa: {
        Row: {
          access_level: string | null
          company_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          access_level?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          access_level?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_acesso_usuario_empresa_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_acesso_usuario_empresa_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_anexos: {
        Row: {
          created_at: string | null
          created_by: string | null
          entity_id: string
          entity_type: string | null
          file_name: string | null
          file_url: string | null
          id: string
          mime_type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          entity_id: string
          entity_type?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          entity_id?: string
          entity_type?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_anexos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_comentarios_tarefa: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_comentarios_tarefa_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_tarefas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_comentarios_tarefa_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_departamentos: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          name: string
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_departamentos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_departamentos_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_unidades_negocio"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_empresas: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      adailton2_0_eventos: {
        Row: {
          calendar_provider: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          department_id: string | null
          description: string | null
          end_at: string | null
          event_type: string | null
          external_event_id: string | null
          id: string
          location: string | null
          meeting_link: string | null
          project_id: string | null
          start_at: string
          status: string | null
          title: string
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          calendar_provider?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          end_at?: string | null
          event_type?: string | null
          external_event_id?: string | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          project_id?: string | null
          start_at: string
          status?: string | null
          title: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          calendar_provider?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          end_at?: string | null
          event_type?: string | null
          external_event_id?: string | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          project_id?: string | null
          start_at?: string
          status?: string | null
          title?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_eventos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_eventos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_eventos_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_eventos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_eventos_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_unidades_negocio"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_historico_tarefa: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          field_name: string | null
          id: string
          new_value: string | null
          old_value: string | null
          task_id: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          field_name?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          task_id?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          field_name?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_historico_tarefa_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_historico_tarefa_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_tarefas"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_integracoes_empresa: {
        Row: {
          company_id: string | null
          config: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          provider: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          config?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          provider: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          config?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          provider?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_integracoes_empresa_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_lembretes: {
        Row: {
          channel: string | null
          created_at: string | null
          entity_id: string
          entity_type: string | null
          id: string
          message_template: string | null
          offset_minutes: number | null
          recurrence_rule: string | null
          reminder_type: string | null
          status: string | null
          trigger_at: string | null
          user_id: string | null
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          entity_id: string
          entity_type?: string | null
          id?: string
          message_template?: string | null
          offset_minutes?: number | null
          recurrence_rule?: string | null
          reminder_type?: string | null
          status?: string | null
          trigger_at?: string | null
          user_id?: string | null
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string | null
          id?: string
          message_template?: string | null
          offset_minutes?: number | null
          recurrence_rule?: string | null
          reminder_type?: string | null
          status?: string | null
          trigger_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_lembretes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_notificacoes: {
        Row: {
          body: string | null
          company_id: string | null
          created_at: string | null
          id: string
          read_at: string | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          read_at?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          read_at?: string | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_notificacoes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_notificacoes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_ocorrencias_rotina: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          routine_id: string | null
          scheduled_for: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          routine_id?: string | null
          scheduled_for: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          routine_id?: string | null
          scheduled_for?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_ocorrencias_rotina_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_ocorrencias_rotina_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_rotinas"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_participantes_evento: {
        Row: {
          created_at: string | null
          email: string | null
          event_id: string | null
          id: string
          name: string | null
          participant_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          event_id?: string | null
          id?: string
          name?: string | null
          participant_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          event_id?: string | null
          id?: string
          name?: string | null
          participant_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_participantes_evento_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_participantes_evento_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_perfis: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      adailton2_0_projetos: {
        Row: {
          company_id: string | null
          created_at: string | null
          department_id: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_projetos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_projetos_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_projetos_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_unidades_negocio"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_resumos_diarios: {
        Row: {
          briefing_date: string
          content_json: Json | null
          generated_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          briefing_date: string
          content_json?: Json | null
          generated_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          briefing_date?: string
          content_json?: Json | null
          generated_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_resumos_diarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_rotinas: {
        Row: {
          assigned_to: string | null
          category: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          department_id: string | null
          description: string | null
          end_date: string | null
          frequency_config: Json | null
          frequency_type: string | null
          id: string
          preferred_time: string
          priority: string | null
          project_id: string | null
          requires_confirmation: boolean | null
          scope_id: string | null
          scope_type: string | null
          start_date: string
          status: string | null
          title: string
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          end_date?: string | null
          frequency_config?: Json | null
          frequency_type?: string | null
          id?: string
          preferred_time: string
          priority?: string | null
          project_id?: string | null
          requires_confirmation?: boolean | null
          scope_id?: string | null
          scope_type?: string | null
          start_date: string
          status?: string | null
          title: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          end_date?: string | null
          frequency_config?: Json | null
          frequency_type?: string | null
          id?: string
          preferred_time?: string
          priority?: string | null
          project_id?: string | null
          requires_confirmation?: boolean | null
          scope_id?: string | null
          scope_type?: string | null
          start_date?: string
          status?: string | null
          title?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_rotinas_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_rotinas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_rotinas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_rotinas_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_rotinas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_rotinas_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_unidades_negocio"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_solicitacoes_ia: {
        Row: {
          created_at: string | null
          entities_json: Json | null
          execution_status: string | null
          id: string
          input_type: string | null
          intent: string | null
          original_input: string | null
          response_text: string | null
          transcript: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entities_json?: Json | null
          execution_status?: string | null
          id?: string
          input_type?: string | null
          intent?: string | null
          original_input?: string | null
          response_text?: string | null
          transcript?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entities_json?: Json | null
          execution_status?: string | null
          id?: string
          input_type?: string | null
          intent?: string | null
          original_input?: string | null
          response_text?: string | null
          transcript?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_solicitacoes_ia_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_tarefas: {
        Row: {
          assigned_to: string | null
          audio_url: string | null
          company_id: string
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          department_id: string | null
          description: string | null
          due_date: string
          id: string
          origin: string | null
          priority: string | null
          project_id: string | null
          source_text: string | null
          status: string | null
          tags: Json | null
          title: string
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          audio_url?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          due_date: string
          id?: string
          origin?: string | null
          priority?: string | null
          project_id?: string | null
          source_text?: string | null
          status?: string | null
          tags?: Json | null
          title: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          audio_url?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          due_date?: string
          id?: string
          origin?: string | null
          priority?: string | null
          project_id?: string | null
          source_text?: string | null
          status?: string | null
          tags?: Json | null
          title?: string
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_tarefas_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_tarefas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_tarefas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "adailton2_0_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_tarefas_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_tarefas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adailton2_0_tarefas_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_unidades_negocio"
            referencedColumns: ["id"]
          },
        ]
      }
      adailton2_0_unidades_negocio: {
        Row: {
          city: string | null
          company_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adailton2_0_unidades_negocio_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "adailton2_0_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      aplicacoes: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aplicacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      aportes_capital: {
        Row: {
          aplicacao_id: string | null
          aporte_principal_id: string | null
          created_at: string
          data_aporte: string
          data_pagamento: string | null
          descricao: string
          eh_parcelado: boolean
          empresa_id: string
          id: string
          numero_documento: string | null
          observacoes: string | null
          parcela_numero: number | null
          parcela_total: number | null
          quantidade_parcelas: number | null
          socio_id: string
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          aplicacao_id?: string | null
          aporte_principal_id?: string | null
          created_at?: string
          data_aporte: string
          data_pagamento?: string | null
          descricao: string
          eh_parcelado?: boolean
          empresa_id: string
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          quantidade_parcelas?: number | null
          socio_id: string
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          aplicacao_id?: string | null
          aporte_principal_id?: string | null
          created_at?: string
          data_aporte?: string
          data_pagamento?: string | null
          descricao?: string
          eh_parcelado?: boolean
          empresa_id?: string
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          quantidade_parcelas?: number | null
          socio_id?: string
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "aportes_capital_aplicacao_id_fkey"
            columns: ["aplicacao_id"]
            isOneToOne: false
            referencedRelation: "aplicacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aportes_capital_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aportes_capital_socio_id_fkey"
            columns: ["socio_id"]
            isOneToOne: false
            referencedRelation: "socios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_aporte_principal"
            columns: ["aporte_principal_id"]
            isOneToOne: false
            referencedRelation: "aportes_capital"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bancos: {
        Row: {
          codigo: string | null
          created_at: string
          id: string
          logo_url: string | null
          nome: string
          updated_at: string
        }
        Insert: {
          codigo?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          nome: string
          updated_at?: string
        }
        Update: {
          codigo?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      candidatos: {
        Row: {
          cpf: string | null
          created_at: string
          email: string
          funcao_id: string
          id: string
          nome: string
          status: Database["public"]["Enums"]["status_candidato"]
          teste_id: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          email: string
          funcao_id: string
          id?: string
          nome: string
          status?: Database["public"]["Enums"]["status_candidato"]
          teste_id?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string
          email?: string
          funcao_id?: string
          id?: string
          nome?: string
          status?: Database["public"]["Enums"]["status_candidato"]
          teste_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidatos_funcao_id_fkey"
            columns: ["funcao_id"]
            isOneToOne: false
            referencedRelation: "funcoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidatos_teste_id_fkey"
            columns: ["teste_id"]
            isOneToOne: false
            referencedRelation: "testes"
            referencedColumns: ["id"]
          },
        ]
      }
      carregamentos: {
        Row: {
          cliente: string
          created_at: string | null
          dados_caminhao: string | null
          data_atualizacao: string | null
          data_carregamento: string | null
          id: number
          n_pedido: string
          nome_remetente: string | null
          ordem_entrega: string | null
          tipo_mensagem: string | null
          updated_at: string | null
        }
        Insert: {
          cliente: string
          created_at?: string | null
          dados_caminhao?: string | null
          data_atualizacao?: string | null
          data_carregamento?: string | null
          id?: number
          n_pedido: string
          nome_remetente?: string | null
          ordem_entrega?: string | null
          tipo_mensagem?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente?: string
          created_at?: string | null
          dados_caminhao?: string | null
          data_atualizacao?: string | null
          data_carregamento?: string | null
          id?: number
          n_pedido?: string
          nome_remetente?: string | null
          ordem_entrega?: string | null
          tipo_mensagem?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cliente_licencas_exigidas: {
        Row: {
          arquivo_url: string | null
          atualizado_em: string | null
          cliente_id: string
          created_at: string | null
          criado_em: string | null
          id: string
          obrigatoria: boolean
          observacoes: string | null
          tipo_licenca_id: string
          validade_personalizada_meses: number | null
        }
        Insert: {
          arquivo_url?: string | null
          atualizado_em?: string | null
          cliente_id: string
          created_at?: string | null
          criado_em?: string | null
          id?: string
          obrigatoria?: boolean
          observacoes?: string | null
          tipo_licenca_id: string
          validade_personalizada_meses?: number | null
        }
        Update: {
          arquivo_url?: string | null
          atualizado_em?: string | null
          cliente_id?: string
          created_at?: string | null
          criado_em?: string | null
          id?: string
          obrigatoria?: boolean
          observacoes?: string | null
          tipo_licenca_id?: string
          validade_personalizada_meses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cliente_licencas_exigidas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "sucena_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cliente_licencas_exigidas_tipo_licenca_id_fkey"
            columns: ["tipo_licenca_id"]
            isOneToOne: false
            referencedRelation: "tipos_licencas"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj_cpf: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      concrem_base_premiacao: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          tipo: string | null
          updated_at: string
          valor_base: number
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          tipo?: string | null
          updated_at?: string
          valor_base: number
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          tipo?: string | null
          updated_at?: string
          valor_base?: number
        }
        Relationships: []
      }
      concrem_categorias: {
        Row: {
          ativo: boolean
          cor: string | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cor?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cor?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      concrem_dss: {
        Row: {
          created_at: string
          data_realizacao: string
          descricao: string | null
          id: string
          observacoes: string | null
          participantes_ids: string[] | null
          responsavel_id: string | null
          setor_id: string | null
          titulo: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_realizacao: string
          descricao?: string | null
          id?: string
          observacoes?: string | null
          participantes_ids?: string[] | null
          responsavel_id?: string | null
          setor_id?: string | null
          titulo: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_realizacao?: string
          descricao?: string | null
          id?: string
          observacoes?: string | null
          participantes_ids?: string[] | null
          responsavel_id?: string | null
          setor_id?: string | null
          titulo?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concrem_dss_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "concrem_funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concrem_dss_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "concrem_setores"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_empresas: {
        Row: {
          ativo: boolean
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      concrem_epi: {
        Row: {
          created_at: string
          data_entrega: string
          data_vencimento: string | null
          descricao: string | null
          funcionario_id: string | null
          id: string
          numero_ca: string | null
          observacoes: string | null
          status: string | null
          tipo_epi: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_entrega: string
          data_vencimento?: string | null
          descricao?: string | null
          funcionario_id?: string | null
          id?: string
          numero_ca?: string | null
          observacoes?: string | null
          status?: string | null
          tipo_epi: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_entrega?: string
          data_vencimento?: string | null
          descricao?: string | null
          funcionario_id?: string | null
          id?: string
          numero_ca?: string | null
          observacoes?: string | null
          status?: string | null
          tipo_epi?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concrem_epi_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "concrem_funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_faixas: {
        Row: {
          ativo: boolean
          categoria_id: string | null
          created_at: string
          id: string
          nome: string
          updated_at: string
          valor: number | null
        }
        Insert: {
          ativo?: boolean
          categoria_id?: string | null
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
          valor?: number | null
        }
        Update: {
          ativo?: boolean
          categoria_id?: string | null
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "concrem_faixas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "concrem_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_faltas_advertencias: {
        Row: {
          aplicado_por: string | null
          created_at: string
          data_ocorrencia: string
          descricao: string | null
          funcionario_id: string | null
          gravidade: string | null
          id: string
          motivo: string
          observacoes: string | null
          quantidade: number | null
          tipo: string
          updated_at: string
        }
        Insert: {
          aplicado_por?: string | null
          created_at?: string
          data_ocorrencia: string
          descricao?: string | null
          funcionario_id?: string | null
          gravidade?: string | null
          id?: string
          motivo: string
          observacoes?: string | null
          quantidade?: number | null
          tipo: string
          updated_at?: string
        }
        Update: {
          aplicado_por?: string | null
          created_at?: string
          data_ocorrencia?: string
          descricao?: string | null
          funcionario_id?: string | null
          gravidade?: string | null
          id?: string
          motivo?: string
          observacoes?: string | null
          quantidade?: number | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concrem_faltas_advertencias_aplicado_por_fkey"
            columns: ["aplicado_por"]
            isOneToOne: false
            referencedRelation: "concrem_funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concrem_faltas_advertencias_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "concrem_funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_formulas_calculo: {
        Row: {
          ativo: boolean
          base_premiacao_id: string | null
          categoria_id: string | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          peso_advertencias: number | null
          peso_dss: number | null
          peso_epi: number | null
          peso_faltas: number | null
          peso_producao_setor: number | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          base_premiacao_id?: string | null
          categoria_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          peso_advertencias?: number | null
          peso_dss?: number | null
          peso_epi?: number | null
          peso_faltas?: number | null
          peso_producao_setor?: number | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          base_premiacao_id?: string | null
          categoria_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          peso_advertencias?: number | null
          peso_dss?: number | null
          peso_epi?: number | null
          peso_faltas?: number | null
          peso_producao_setor?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concrem_formulas_calculo_base_premiacao_id_fkey"
            columns: ["base_premiacao_id"]
            isOneToOne: false
            referencedRelation: "concrem_base_premiacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concrem_formulas_calculo_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "concrem_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_funcionarios: {
        Row: {
          ativo: boolean
          base_premiacao_id: string | null
          categoria_id: string | null
          cpf: string | null
          created_at: string
          data_admissao: string | null
          data_demissao: string | null
          data_nascimento: string | null
          email: string | null
          empresa_id: string | null
          faixa_id: string | null
          funcao_id: string | null
          id: string
          nome: string
          salario: number | null
          setor_id: string | null
          status: Database["public"]["Enums"]["status_funcionario"]
          telefone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          base_premiacao_id?: string | null
          categoria_id?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          data_demissao?: string | null
          data_nascimento?: string | null
          email?: string | null
          empresa_id?: string | null
          faixa_id?: string | null
          funcao_id?: string | null
          id?: string
          nome: string
          salario?: number | null
          setor_id?: string | null
          status?: Database["public"]["Enums"]["status_funcionario"]
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          base_premiacao_id?: string | null
          categoria_id?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          data_demissao?: string | null
          data_nascimento?: string | null
          email?: string | null
          empresa_id?: string | null
          faixa_id?: string | null
          funcao_id?: string | null
          id?: string
          nome?: string
          salario?: number | null
          setor_id?: string | null
          status?: Database["public"]["Enums"]["status_funcionario"]
          telefone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concrem_funcionarios_base_premiacao_id_fkey"
            columns: ["base_premiacao_id"]
            isOneToOne: false
            referencedRelation: "concrem_base_premiacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concrem_funcionarios_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "concrem_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concrem_funcionarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "concrem_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concrem_funcionarios_faixa_id_fkey"
            columns: ["faixa_id"]
            isOneToOne: false
            referencedRelation: "concrem_faixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concrem_funcionarios_funcao_id_fkey"
            columns: ["funcao_id"]
            isOneToOne: false
            referencedRelation: "concrem_funcoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concrem_funcionarios_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "concrem_setores"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_funcoes: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nivel_hierarquico: number | null
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nivel_hierarquico?: number | null
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nivel_hierarquico?: number | null
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      concrem_indicadores_gerais: {
        Row: {
          competencia: string
          created_at: string
          id: string
          meta: number
          percentual: number
          realizado: number
          tipo_indicador_id: string
          updated_at: string
        }
        Insert: {
          competencia: string
          created_at?: string
          id?: string
          meta: number
          percentual: number
          realizado: number
          tipo_indicador_id: string
          updated_at?: string
        }
        Update: {
          competencia?: string
          created_at?: string
          id?: string
          meta?: number
          percentual?: number
          realizado?: number
          tipo_indicador_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concrem_indicadores_gerais_tipo_indicador_id_fkey"
            columns: ["tipo_indicador_id"]
            isOneToOne: false
            referencedRelation: "concrem_tipos_indicadores_gerais"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_leads_marketing: {
        Row: {
          acabamento: string | null
          atendente: string | null
          canal_comunicacao: string | null
          cidade: string | null
          cnpj_fechado: string | null
          contato: string | null
          cpf_cnpj: string | null
          created_at: string
          data_chegada: string | null
          data_fechamento: string | null
          data_orcamento: string | null
          id: string
          mes_fechamento: string | null
          mes_orcamento: string | null
          nome_contato: string | null
          numero_orcamento: string | null
          numero_pedido: string | null
          obs_representantes: string | null
          observacoes: string | null
          publico: string | null
          quantidade: number | null
          ramo: string | null
          razao_social: string | null
          representante: string | null
          status_atendimento: string | null
          tempo_fechamento: number | null
          uf: string | null
          updated_at: string
          valor_orcamento: number | null
        }
        Insert: {
          acabamento?: string | null
          atendente?: string | null
          canal_comunicacao?: string | null
          cidade?: string | null
          cnpj_fechado?: string | null
          contato?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          data_chegada?: string | null
          data_fechamento?: string | null
          data_orcamento?: string | null
          id?: string
          mes_fechamento?: string | null
          mes_orcamento?: string | null
          nome_contato?: string | null
          numero_orcamento?: string | null
          numero_pedido?: string | null
          obs_representantes?: string | null
          observacoes?: string | null
          publico?: string | null
          quantidade?: number | null
          ramo?: string | null
          razao_social?: string | null
          representante?: string | null
          status_atendimento?: string | null
          tempo_fechamento?: number | null
          uf?: string | null
          updated_at?: string
          valor_orcamento?: number | null
        }
        Update: {
          acabamento?: string | null
          atendente?: string | null
          canal_comunicacao?: string | null
          cidade?: string | null
          cnpj_fechado?: string | null
          contato?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          data_chegada?: string | null
          data_fechamento?: string | null
          data_orcamento?: string | null
          id?: string
          mes_fechamento?: string | null
          mes_orcamento?: string | null
          nome_contato?: string | null
          numero_orcamento?: string | null
          numero_pedido?: string | null
          obs_representantes?: string | null
          observacoes?: string | null
          publico?: string | null
          quantidade?: number | null
          ramo?: string | null
          razao_social?: string | null
          representante?: string | null
          status_atendimento?: string | null
          tempo_fechamento?: number | null
          uf?: string | null
          updated_at?: string
          valor_orcamento?: number | null
        }
        Relationships: []
      }
      concrem_orcamentos: {
        Row: {
          cliente: string
          created_at: string | null
          data_orcamento: string | null
          id: number
          motivo_perda: string | null
          n_orcamento: number
          orcamento_qtd_produtos: number
          orcamento_total: number
          produto: string
          representante: string
          status: string | null
          uf: string
          updated_at: string | null
          usuario: string | null
        }
        Insert: {
          cliente: string
          created_at?: string | null
          data_orcamento?: string | null
          id?: number
          motivo_perda?: string | null
          n_orcamento: number
          orcamento_qtd_produtos: number
          orcamento_total: number
          produto: string
          representante: string
          status?: string | null
          uf: string
          updated_at?: string | null
          usuario?: string | null
        }
        Update: {
          cliente?: string
          created_at?: string | null
          data_orcamento?: string | null
          id?: number
          motivo_perda?: string | null
          n_orcamento?: number
          orcamento_qtd_produtos?: number
          orcamento_total?: number
          produto?: string
          representante?: string
          status?: string | null
          uf?: string
          updated_at?: string | null
          usuario?: string | null
        }
        Relationships: []
      }
      concrem_pedidos_venda: {
        Row: {
          cliente_bairro: string | null
          cliente_cep: string | null
          cliente_cidade: string | null
          cliente_cnpj: string | null
          cliente_codigo: string | null
          cliente_email: string | null
          cliente_endereco: string | null
          cliente_estab: string | null
          cliente_fantasia: string | null
          cliente_inscest: string | null
          cliente_nome: string | null
          cliente_telefone: string | null
          cliente_uf: string | null
          created_at: string
          dados_tabela: Json
          data_emissao: string | null
          data_validade: string | null
          desconto: number
          frete: number
          id: string
          id_nota_conf: number | null
          numero_pedido: string
          ped_compra_cliente: string | null
          previsao_embarque: string | null
          representante: string | null
          total_pedido_venda: number
          total_produtos: number
          total_qtd: number
          total_qtd_m3: number
          updated_at: string
        }
        Insert: {
          cliente_bairro?: string | null
          cliente_cep?: string | null
          cliente_cidade?: string | null
          cliente_cnpj?: string | null
          cliente_codigo?: string | null
          cliente_email?: string | null
          cliente_endereco?: string | null
          cliente_estab?: string | null
          cliente_fantasia?: string | null
          cliente_inscest?: string | null
          cliente_nome?: string | null
          cliente_telefone?: string | null
          cliente_uf?: string | null
          created_at?: string
          dados_tabela?: Json
          data_emissao?: string | null
          data_validade?: string | null
          desconto?: number
          frete?: number
          id?: string
          id_nota_conf?: number | null
          numero_pedido: string
          ped_compra_cliente?: string | null
          previsao_embarque?: string | null
          representante?: string | null
          total_pedido_venda?: number
          total_produtos?: number
          total_qtd?: number
          total_qtd_m3?: number
          updated_at?: string
        }
        Update: {
          cliente_bairro?: string | null
          cliente_cep?: string | null
          cliente_cidade?: string | null
          cliente_cnpj?: string | null
          cliente_codigo?: string | null
          cliente_email?: string | null
          cliente_endereco?: string | null
          cliente_estab?: string | null
          cliente_fantasia?: string | null
          cliente_inscest?: string | null
          cliente_nome?: string | null
          cliente_telefone?: string | null
          cliente_uf?: string | null
          created_at?: string
          dados_tabela?: Json
          data_emissao?: string | null
          data_validade?: string | null
          desconto?: number
          frete?: number
          id?: string
          id_nota_conf?: number | null
          numero_pedido?: string
          ped_compra_cliente?: string | null
          previsao_embarque?: string | null
          representante?: string | null
          total_pedido_venda?: number
          total_produtos?: number
          total_qtd?: number
          total_qtd_m3?: number
          updated_at?: string
        }
        Relationships: []
      }
      concrem_producao_setor: {
        Row: {
          created_at: string
          data_producao: string
          id: string
          meta_diaria: number | null
          observacoes: string | null
          producao_realizada: number | null
          setor_id: string | null
          unidade_medida: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_producao: string
          id?: string
          meta_diaria?: number | null
          observacoes?: string | null
          producao_realizada?: number | null
          setor_id?: string | null
          unidade_medida?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_producao?: string
          id?: string
          meta_diaria?: number | null
          observacoes?: string | null
          producao_realizada?: number | null
          setor_id?: string | null
          unidade_medida?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concrem_producao_setor_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "concrem_setores"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_resultados_premiacao: {
        Row: {
          base_premiacao_id: string | null
          bonus_alcancado: number
          bonus_possivel: number
          categoria: string | null
          cod_funcionario: string | null
          created_at: string
          faixa: string | null
          funcao: string | null
          funcionario_id: string | null
          id: string
          mes_competencia: string
          nome: string
          nota_advertencias: number
          nota_dss: number
          nota_epi: number
          nota_faltas: number
          nota_geral: number
          nota_producao: number | null
          setor: string | null
          updated_at: string
          valor_faixa: number | null
          valor_kits: number | null
        }
        Insert: {
          base_premiacao_id?: string | null
          bonus_alcancado: number
          bonus_possivel: number
          categoria?: string | null
          cod_funcionario?: string | null
          created_at?: string
          faixa?: string | null
          funcao?: string | null
          funcionario_id?: string | null
          id?: string
          mes_competencia: string
          nome: string
          nota_advertencias?: number
          nota_dss?: number
          nota_epi?: number
          nota_faltas?: number
          nota_geral: number
          nota_producao?: number | null
          setor?: string | null
          updated_at?: string
          valor_faixa?: number | null
          valor_kits?: number | null
        }
        Update: {
          base_premiacao_id?: string | null
          bonus_alcancado?: number
          bonus_possivel?: number
          categoria?: string | null
          cod_funcionario?: string | null
          created_at?: string
          faixa?: string | null
          funcao?: string | null
          funcionario_id?: string | null
          id?: string
          mes_competencia?: string
          nome?: string
          nota_advertencias?: number
          nota_dss?: number
          nota_epi?: number
          nota_faltas?: number
          nota_geral?: number
          nota_producao?: number | null
          setor?: string | null
          updated_at?: string
          valor_faixa?: number | null
          valor_kits?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "concrem_resultados_premiacao_base_premiacao_id_fkey"
            columns: ["base_premiacao_id"]
            isOneToOne: false
            referencedRelation: "concrem_base_premiacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concrem_resultados_premiacao_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "concrem_funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_setores: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concrem_setores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "concrem_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_sn_contas: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      concrem_sn_lancamentos: {
        Row: {
          analitica: string
          conta_id: string | null
          created_at: string
          data_lancamento: string
          historico: string | null
          id: string
          idlanfin: number
          responsavel_id: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          analitica: string
          conta_id?: string | null
          created_at?: string
          data_lancamento: string
          historico?: string | null
          id?: string
          idlanfin?: number
          responsavel_id?: string | null
          updated_at?: string
          valor: number
        }
        Update: {
          analitica?: string
          conta_id?: string | null
          created_at?: string
          data_lancamento?: string
          historico?: string | null
          id?: string
          idlanfin?: number
          responsavel_id?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "concrem_sn_lancamentos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "concrem_sn_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concrem_sn_lancamentos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "concrem_sn_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_sn_regras_categorizacao: {
        Row: {
          ativo: boolean
          conta_id: string | null
          created_at: string
          criterio: string
          id: string
          responsavel_id: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          conta_id?: string | null
          created_at?: string
          criterio: string
          id?: string
          responsavel_id?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          conta_id?: string | null
          created_at?: string
          criterio?: string
          id?: string
          responsavel_id?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concrem_sn_regras_categorizacao_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "concrem_sn_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concrem_sn_regras_categorizacao_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "concrem_sn_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      concrem_sn_responsaveis: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      concrem_sn_usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          id: string
          nome: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          id?: string
          nome: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          id?: string
          nome?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      concrem_tipos_indicadores: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      concrem_tipos_indicadores_gerais: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      concrem_usuarios: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string
          password_hash: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          nome: string
          password_hash: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          password_hash?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      concremprodutos_aplicabilidade: {
        Row: {
          campo: string
          created_at: string
          id: string
          tipo_produto: string
        }
        Insert: {
          campo: string
          created_at?: string
          id?: string
          tipo_produto: string
        }
        Update: {
          campo?: string
          created_at?: string
          id?: string
          tipo_produto?: string
        }
        Relationships: []
      }
      concremprodutos_categorias: {
        Row: {
          ativo: boolean | null
          cor: string | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      concremprodutos_opcoes_classificacao: {
        Row: {
          ativo: boolean | null
          campo: string
          created_at: string | null
          id: string
          valor: string
        }
        Insert: {
          ativo?: boolean | null
          campo: string
          created_at?: string | null
          id?: string
          valor: string
        }
        Update: {
          ativo?: boolean | null
          campo?: string
          created_at?: string | null
          id?: string
          valor?: string
        }
        Relationships: []
      }
      concremprodutos_produtos: {
        Row: {
          alizar_a: number | null
          alizar_e: number | null
          alizar_l: number | null
          altura_cm: number | null
          ativo: boolean
          batente_cm: number | null
          batente_tipo: string | null
          categoria_id: string | null
          campos_regra: string[]
          codigo: string | null
          codigo_barras: string | null
          cor: string | null
          created_at: string | null
          descricao: string
          enchimento: string | null
          espessura_cm: number | null
          id: string
          largura_cm: number | null
          linha: string | null
          movimento: string | null
          perfil: string | null
          preco: number | null
          revestimento: string | null
          situacao: string | null
          subcategoria_id: string | null
          tem_bandeira: boolean | null
          tem_veneziana: boolean | null
          tem_visor: boolean | null
          tipo_produto: string | null
          unidade: string | null
          updated_at: string | null
        }
        Insert: {
          alizar_a?: number | null
          alizar_e?: number | null
          alizar_l?: number | null
          altura_cm?: number | null
          ativo?: boolean
          batente_cm?: number | null
          batente_tipo?: string | null
          categoria_id?: string | null
          campos_regra?: string[]
          codigo?: string | null
          codigo_barras?: string | null
          cor?: string | null
          created_at?: string | null
          descricao: string
          enchimento?: string | null
          espessura_cm?: number | null
          id?: string
          largura_cm?: number | null
          linha?: string | null
          movimento?: string | null
          perfil?: string | null
          preco?: number | null
          revestimento?: string | null
          situacao?: string | null
          subcategoria_id?: string | null
          tem_bandeira?: boolean | null
          tem_veneziana?: boolean | null
          tem_visor?: boolean | null
          tipo_produto?: string | null
          unidade?: string | null
          updated_at?: string | null
        }
        Update: {
          alizar_a?: number | null
          alizar_e?: number | null
          alizar_l?: number | null
          altura_cm?: number | null
          ativo?: boolean
          batente_cm?: number | null
          batente_tipo?: string | null
          categoria_id?: string | null
          campos_regra?: string[]
          codigo?: string | null
          codigo_barras?: string | null
          cor?: string | null
          created_at?: string | null
          descricao?: string
          enchimento?: string | null
          espessura_cm?: number | null
          id?: string
          largura_cm?: number | null
          linha?: string | null
          movimento?: string | null
          perfil?: string | null
          preco?: number | null
          revestimento?: string | null
          situacao?: string | null
          subcategoria_id?: string | null
          tem_bandeira?: boolean | null
          tem_veneziana?: boolean | null
          tem_visor?: boolean | null
          tipo_produto?: string | null
          unidade?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concremprodutos_produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "concremprodutos_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concremprodutos_produtos_subcategoria_id_fkey"
            columns: ["subcategoria_id"]
            isOneToOne: false
            referencedRelation: "concremprodutos_subcategorias"
            referencedColumns: ["id"]
          },
        ]
      }
      concremprodutos_regras_atributo: {
        Row: {
          ativo: boolean | null
          campo: string
          created_at: string | null
          criterio: string
          id: string
          prioridade: number | null
          tipo_match: string
          updated_at: string | null
          valor: string
        }
        Insert: {
          ativo?: boolean | null
          campo: string
          created_at?: string | null
          criterio: string
          id?: string
          prioridade?: number | null
          tipo_match?: string
          updated_at?: string | null
          valor: string
        }
        Update: {
          ativo?: boolean | null
          campo?: string
          created_at?: string | null
          criterio?: string
          id?: string
          prioridade?: number | null
          tipo_match?: string
          updated_at?: string | null
          valor?: string
        }
        Relationships: []
      }
      concremprodutos_regras_classificacao: {
        Row: {
          ativo: boolean | null
          categoria_id: string | null
          created_at: string | null
          criterio: string
          id: string
          prioridade: number | null
          subcategoria_id: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria_id?: string | null
          created_at?: string | null
          criterio: string
          id?: string
          prioridade?: number | null
          subcategoria_id?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria_id?: string | null
          created_at?: string | null
          criterio?: string
          id?: string
          prioridade?: number | null
          subcategoria_id?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concremprodutos_regras_classificacao_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "concremprodutos_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concremprodutos_regras_classificacao_subcategoria_id_fkey"
            columns: ["subcategoria_id"]
            isOneToOne: false
            referencedRelation: "concremprodutos_subcategorias"
            referencedColumns: ["id"]
          },
        ]
      }
      concremprodutos_subcategorias: {
        Row: {
          ativo: boolean | null
          categoria_id: string
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          categoria_id: string
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          categoria_id?: string
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "concremprodutos_subcategorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "concremprodutos_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      concremprodutos_usuarios: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string
          id: string
          nome: string
          senha_hash: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          senha_hash: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          senha_hash?: string
        }
        Relationships: []
      }
      concremtabelaprecos_acabamentos: {
        Row: {
          ativo: boolean
          cor_hex: string | null
          created_at: string
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean
          cor_hex?: string | null
          created_at?: string
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean
          cor_hex?: string | null
          created_at?: string
          id?: number
          nome?: string
        }
        Relationships: []
      }
      concremtabelaprecos_componentes: {
        Row: {
          acabamento_id: number | null
          altura: number | null
          ativo: boolean
          codigo_sku: string | null
          created_at: string
          enchimento: string | null
          estoque_atual: number
          estoque_minimo: number
          id: number
          largura: number | null
          linha_id: number | null
          revestimento: string | null
          tamanho: string | null
          tipo_id: number
          updated_at: string
          valor: number
        }
        Insert: {
          acabamento_id?: number | null
          altura?: number | null
          ativo?: boolean
          codigo_sku?: string | null
          created_at?: string
          enchimento?: string | null
          estoque_atual?: number
          estoque_minimo?: number
          id?: number
          largura?: number | null
          linha_id?: number | null
          revestimento?: string | null
          tamanho?: string | null
          tipo_id: number
          updated_at?: string
          valor: number
        }
        Update: {
          acabamento_id?: number | null
          altura?: number | null
          ativo?: boolean
          codigo_sku?: string | null
          created_at?: string
          enchimento?: string | null
          estoque_atual?: number
          estoque_minimo?: number
          id?: number
          largura?: number | null
          linha_id?: number | null
          revestimento?: string | null
          tamanho?: string | null
          tipo_id?: number
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "concremtabelaprecos_componentes_acabamento_id_fkey"
            columns: ["acabamento_id"]
            isOneToOne: false
            referencedRelation: "concremtabelaprecos_acabamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concremtabelaprecos_componentes_linha_id_fkey"
            columns: ["linha_id"]
            isOneToOne: false
            referencedRelation: "concremtabelaprecos_linhas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concremtabelaprecos_componentes_tipo_id_fkey"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "concremtabelaprecos_tipos"
            referencedColumns: ["id"]
          },
        ]
      }
      concremtabelaprecos_linhas: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: number
          nome: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: number
          nome: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: number
          nome?: string
        }
        Relationships: []
      }
      concremtabelaprecos_orcamento_itens: {
        Row: {
          componentes_json: Json | null
          desconto: number
          descricao: string
          id: number
          orcamento_id: number
          ordem: number
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          componentes_json?: Json | null
          desconto: number
          descricao: string
          id?: number
          orcamento_id: number
          ordem: number
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Update: {
          componentes_json?: Json | null
          desconto?: number
          descricao?: string
          id?: number
          orcamento_id?: number
          ordem?: number
          quantidade?: number
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "concremtabelaprecos_orcamento_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "concremtabelaprecos_orcamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      concremtabelaprecos_orcamentos: {
        Row: {
          cliente_email: string | null
          cliente_nome: string
          cliente_telefone: string | null
          created_at: string
          data_orcamento: string
          data_validade: string | null
          desconto_total: number
          id: number
          numero_orcamento: string
          observacoes: string | null
          status: string
          updated_at: string
          valor_total: number
          vendedor: string | null
        }
        Insert: {
          cliente_email?: string | null
          cliente_nome: string
          cliente_telefone?: string | null
          created_at?: string
          data_orcamento: string
          data_validade?: string | null
          desconto_total: number
          id?: number
          numero_orcamento: string
          observacoes?: string | null
          status: string
          updated_at?: string
          valor_total: number
          vendedor?: string | null
        }
        Update: {
          cliente_email?: string | null
          cliente_nome?: string
          cliente_telefone?: string | null
          created_at?: string
          data_orcamento?: string
          data_validade?: string | null
          desconto_total?: number
          id?: number
          numero_orcamento?: string
          observacoes?: string | null
          status?: string
          updated_at?: string
          valor_total?: number
          vendedor?: string | null
        }
        Relationships: []
      }
      concremtabelaprecos_reajustes_preco: {
        Row: {
          acabamento_id: number | null
          autorizado_por: string
          created_at: string
          data_reajuste: string
          id: number
          observacoes: string | null
          percentual_reajuste: number
          quantidade_itens_afetados: number
          tamanho: string | null
          tipo_id: number | null
        }
        Insert: {
          acabamento_id?: number | null
          autorizado_por: string
          created_at?: string
          data_reajuste: string
          id?: number
          observacoes?: string | null
          percentual_reajuste: number
          quantidade_itens_afetados: number
          tamanho?: string | null
          tipo_id?: number | null
        }
        Update: {
          acabamento_id?: number | null
          autorizado_por?: string
          created_at?: string
          data_reajuste?: string
          id?: number
          observacoes?: string | null
          percentual_reajuste?: number
          quantidade_itens_afetados?: number
          tamanho?: string | null
          tipo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "concremtabelaprecos_reajustes_preco_acabamento_id_fkey"
            columns: ["acabamento_id"]
            isOneToOne: false
            referencedRelation: "concremtabelaprecos_acabamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concremtabelaprecos_reajustes_preco_tipo_id_fkey"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "concremtabelaprecos_tipos"
            referencedColumns: ["id"]
          },
        ]
      }
      concremtabelaprecos_sessoes: {
        Row: {
          created_at: string
          expires_at: string
          token: string
          usuario_id: number
        }
        Insert: {
          created_at?: string
          expires_at: string
          token: string
          usuario_id: number
        }
        Update: {
          created_at?: string
          expires_at?: string
          token?: string
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "concremtabelaprecos_sessoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "concremtabelaprecos_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      concremtabelaprecos_tabelas_preco: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: number
          nome: string
          percentual_adicional: number
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: number
          nome: string
          percentual_adicional: number
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: number
          nome?: string
          percentual_adicional?: number
        }
        Relationships: []
      }
      concremtabelaprecos_tipos: {
        Row: {
          created_at: string
          id: number
          nome: string
          ordem_exibicao: number
        }
        Insert: {
          created_at?: string
          id?: number
          nome: string
          ordem_exibicao: number
        }
        Update: {
          created_at?: string
          id?: number
          nome?: string
          ordem_exibicao?: number
        }
        Relationships: []
      }
      concremtabelaprecos_usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          id: number
          nome: string
          role: string
          senha_hash: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          id?: number
          nome: string
          role?: string
          senha_hash: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          id?: number
          nome?: string
          role?: string
          senha_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      contas_bancarias: {
        Row: {
          agencia: string | null
          ativo: boolean
          banco_id: string
          conta: string | null
          created_at: string
          empresa_id: string
          id: string
          saldo_atual: number
          tipo_conta: string
          updated_at: string
        }
        Insert: {
          agencia?: string | null
          ativo?: boolean
          banco_id: string
          conta?: string | null
          created_at?: string
          empresa_id: string
          id?: string
          saldo_atual?: number
          tipo_conta?: string
          updated_at?: string
        }
        Update: {
          agencia?: string | null
          ativo?: boolean
          banco_id?: string
          conta?: string | null
          created_at?: string
          empresa_id?: string
          id?: string
          saldo_atual?: number
          tipo_conta?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_bancarias_banco_id_fkey"
            columns: ["banco_id"]
            isOneToOne: false
            referencedRelation: "bancos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_bancarias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_pagar: {
        Row: {
          aplicacao_id: string | null
          conta_principal_id: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          descricao: string
          eh_lembrete: boolean
          eh_parcelado: boolean
          empresa_id: string
          fornecedor_id: string
          id: string
          numero_documento: string | null
          observacoes: string | null
          parcela_numero: number | null
          parcela_total: number | null
          plano_conta_id: string | null
          quantidade_parcelas: number | null
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          aplicacao_id?: string | null
          conta_principal_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          descricao: string
          eh_lembrete?: boolean
          eh_parcelado?: boolean
          empresa_id: string
          fornecedor_id: string
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          plano_conta_id?: string | null
          quantidade_parcelas?: number | null
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          aplicacao_id?: string | null
          conta_principal_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string
          eh_lembrete?: boolean
          eh_parcelado?: boolean
          empresa_id?: string
          fornecedor_id?: string
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          plano_conta_id?: string | null
          quantidade_parcelas?: number | null
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "contas_pagar_aplicacao_id_fkey"
            columns: ["aplicacao_id"]
            isOneToOne: false
            referencedRelation: "aplicacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagar_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagar_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagar_plano_conta_id_fkey"
            columns: ["plano_conta_id"]
            isOneToOne: false
            referencedRelation: "plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conta_pagar_principal"
            columns: ["conta_principal_id"]
            isOneToOne: false
            referencedRelation: "contas_pagar"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_receber: {
        Row: {
          aplicacao_id: string | null
          cliente_id: string
          conta_principal_id: string | null
          created_at: string
          data_recebimento: string | null
          data_vencimento: string
          descricao: string
          eh_lembrete: boolean
          eh_parcelado: boolean
          empresa_id: string
          id: string
          numero_documento: string | null
          observacoes: string | null
          parcela_numero: number | null
          parcela_total: number | null
          plano_conta_id: string | null
          quantidade_parcelas: number | null
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          aplicacao_id?: string | null
          cliente_id: string
          conta_principal_id?: string | null
          created_at?: string
          data_recebimento?: string | null
          data_vencimento: string
          descricao: string
          eh_lembrete?: boolean
          eh_parcelado?: boolean
          empresa_id: string
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          plano_conta_id?: string | null
          quantidade_parcelas?: number | null
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          aplicacao_id?: string | null
          cliente_id?: string
          conta_principal_id?: string | null
          created_at?: string
          data_recebimento?: string | null
          data_vencimento?: string
          descricao?: string
          eh_lembrete?: boolean
          eh_parcelado?: boolean
          empresa_id?: string
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          plano_conta_id?: string | null
          quantidade_parcelas?: number | null
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "contas_receber_aplicacao_id_fkey"
            columns: ["aplicacao_id"]
            isOneToOne: false
            referencedRelation: "aplicacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_plano_conta_id_fkey"
            columns: ["plano_conta_id"]
            isOneToOne: false
            referencedRelation: "plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conta_receber_principal"
            columns: ["conta_principal_id"]
            isOneToOne: false
            referencedRelation: "contas_receber"
            referencedColumns: ["id"]
          },
        ]
      }
      crminfinity_funis: {
        Row: {
          created_at: string
          id: string
          instance_id: string
          name: string
          phone_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          instance_id: string
          name: string
          phone_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          instance_id?: string
          name?: string
          phone_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crminfinity_funis_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "crminfinity_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      crminfinity_instances: {
        Row: {
          api_key: string
          api_url: string
          created_at: string
          id: string
          instance_name: string
          updated_at: string
        }
        Insert: {
          api_key: string
          api_url: string
          created_at?: string
          id?: string
          instance_name: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          api_url?: string
          created_at?: string
          id?: string
          instance_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      crminfinity_leads: {
        Row: {
          created_at: string
          funil_id: string
          id: string
          last_message: string | null
          last_message_time: string | null
          name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          funil_id: string
          id?: string
          last_message?: string | null
          last_message_time?: string | null
          name: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          funil_id?: string
          id?: string
          last_message?: string | null
          last_message_time?: string | null
          name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crminfinity_leads_funil_id_fkey"
            columns: ["funil_id"]
            isOneToOne: false
            referencedRelation: "crminfinity_funis"
            referencedColumns: ["id"]
          },
        ]
      }
      crminfinity_messages: {
        Row: {
          created_at: string
          from_me: boolean
          id: string
          lead_id: string
          message: string
          message_type: string
          status: string | null
          timestamp: string
        }
        Insert: {
          created_at?: string
          from_me?: boolean
          id?: string
          lead_id: string
          message: string
          message_type?: string
          status?: string | null
          timestamp: string
        }
        Update: {
          created_at?: string
          from_me?: boolean
          id?: string
          lead_id?: string
          message?: string
          message_type?: string
          status?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "crminfinity_messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crminfinity_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_caixas: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          loja_id: string | null
          nome: string
          saldo_atual: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          loja_id?: string | null
          nome: string
          saldo_atual?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          loja_id?: string | null
          nome?: string
          saldo_atual?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_caixas_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "donamenina_lojas"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_categorias: {
        Row: {
          ativo: boolean
          cor: string | null
          created_at: string
          descricao: string | null
          id: string
          loja_id: string | null
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cor?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          loja_id?: string | null
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cor?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          loja_id?: string | null
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_categorias_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "donamenina_lojas"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_clientes: {
        Row: {
          ativo: boolean
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          id: string
          loja_id: string | null
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          loja_id?: string | null
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          loja_id?: string | null
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_clientes_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "donamenina_lojas"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_estoque_movimentacoes: {
        Row: {
          created_at: string
          id: string
          motivo: string | null
          produto_id: string
          quantidade: number
          tipo: string
          venda_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          motivo?: string | null
          produto_id: string
          quantidade: number
          tipo: string
          venda_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          motivo?: string | null
          produto_id?: string
          quantidade?: number
          tipo?: string
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_estoque_movimentacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "donamenina_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donamenina_estoque_movimentacoes_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "donamenina_vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_lojas: {
        Row: {
          ativo: boolean
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      donamenina_movimentacoes_caixa: {
        Row: {
          caixa_id: string
          created_at: string
          data_movimentacao: string
          descricao: string
          id: string
          plano_conta_id: string | null
          tipo: string
          valor: number
        }
        Insert: {
          caixa_id: string
          created_at?: string
          data_movimentacao?: string
          descricao: string
          id?: string
          plano_conta_id?: string | null
          tipo: string
          valor: number
        }
        Update: {
          caixa_id?: string
          created_at?: string
          data_movimentacao?: string
          descricao?: string
          id?: string
          plano_conta_id?: string | null
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_movimentacoes_caixa_caixa_id_fkey"
            columns: ["caixa_id"]
            isOneToOne: false
            referencedRelation: "donamenina_caixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donamenina_movimentacoes_caixa_plano_conta_id_fkey"
            columns: ["plano_conta_id"]
            isOneToOne: false
            referencedRelation: "donamenina_plano_contas"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_plano_contas: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          loja_id: string | null
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          loja_id?: string | null
          nome: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          loja_id?: string | null
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_plano_contas_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "donamenina_lojas"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_produtos: {
        Row: {
          ativo: boolean
          categoria_id: string | null
          cores: string[] | null
          created_at: string
          descricao: string | null
          estoque_minimo: number | null
          foto_url: string | null
          id: string
          loja_id: string | null
          nome: string
          preco_custo: number | null
          preco_venda: number
          quantidade_estoque: number
          tamanhos: string[] | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria_id?: string | null
          cores?: string[] | null
          created_at?: string
          descricao?: string | null
          estoque_minimo?: number | null
          foto_url?: string | null
          id?: string
          loja_id?: string | null
          nome: string
          preco_custo?: number | null
          preco_venda: number
          quantidade_estoque?: number
          tamanhos?: string[] | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria_id?: string | null
          cores?: string[] | null
          created_at?: string
          descricao?: string | null
          estoque_minimo?: number | null
          foto_url?: string | null
          id?: string
          loja_id?: string | null
          nome?: string
          preco_custo?: number | null
          preco_venda?: number
          quantidade_estoque?: number
          tamanhos?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "donamenina_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donamenina_produtos_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "donamenina_lojas"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["donamenina_app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["donamenina_app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["donamenina_app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "donamenina_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          id: string
          loja_id: string | null
          nome: string
          password_hash: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          id?: string
          loja_id?: string | null
          nome: string
          password_hash?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          id?: string
          loja_id?: string | null
          nome?: string
          password_hash?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_usuarios_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "donamenina_lojas"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_vendas: {
        Row: {
          caixa_id: string
          cliente_id: string | null
          created_at: string
          data_venda: string
          forma_pagamento: string
          id: string
          loja_id: string | null
          valor_total: number
          vendedor_id: string | null
        }
        Insert: {
          caixa_id: string
          cliente_id?: string | null
          created_at?: string
          data_venda?: string
          forma_pagamento: string
          id?: string
          loja_id?: string | null
          valor_total: number
          vendedor_id?: string | null
        }
        Update: {
          caixa_id?: string
          cliente_id?: string | null
          created_at?: string
          data_venda?: string
          forma_pagamento?: string
          id?: string
          loja_id?: string | null
          valor_total?: number
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_vendas_caixa_id_fkey"
            columns: ["caixa_id"]
            isOneToOne: false
            referencedRelation: "donamenina_caixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donamenina_vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "donamenina_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donamenina_vendas_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "donamenina_lojas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donamenina_vendas_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "donamenina_vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_vendas_itens: {
        Row: {
          created_at: string
          id: string
          preco_unitario: number
          produto_id: string
          quantidade: number
          subtotal: number
          venda_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preco_unitario: number
          produto_id: string
          quantidade: number
          subtotal: number
          venda_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preco_unitario?: number
          produto_id?: string
          quantidade?: number
          subtotal?: number
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_vendas_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "donamenina_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donamenina_vendas_itens_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "donamenina_vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      donamenina_vendedores: {
        Row: {
          ativo: boolean
          comissao: number | null
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          loja_id: string | null
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          comissao?: number | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          loja_id?: string | null
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          comissao?: number | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          loja_id?: string | null
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donamenina_vendedores_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "donamenina_lojas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa_socios: {
        Row: {
          ativo: boolean
          created_at: string
          data_entrada: string | null
          empresa_id: string
          id: string
          percentual_participacao: number | null
          socio_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          data_entrada?: string | null
          empresa_id: string
          id?: string
          percentual_participacao?: number | null
          socio_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          data_entrada?: string | null
          empresa_id?: string
          id?: string
          percentual_participacao?: number | null
          socio_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresa_socios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresa_socios_socio_id_fkey"
            columns: ["socio_id"]
            isOneToOne: false
            referencedRelation: "socios"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj: string | null
          cor: string
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          logo_url: string | null
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          cor?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          cor?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      erpinfinity_categorias_produtos: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      erpinfinity_clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj_cpf: string | null
          created_at: string | null
          email: string | null
          empresa_id: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "erpinfinity_clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "erpinfinity_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      erpinfinity_empresas: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj: string | null
          cor: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          logo_url: string | null
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          cor?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          cor?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      erpinfinity_fornecedores: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj_cpf: string | null
          created_at: string | null
          email: string | null
          empresa_id: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string | null
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "erpinfinity_fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "erpinfinity_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      erpinfinity_produtos: {
        Row: {
          ativo: boolean | null
          categoria: string
          codigo: string | null
          created_at: string | null
          descricao: string | null
          empresa_id: string | null
          estoque_atual: number | null
          estoque_minimo: number | null
          id: string
          nome: string
          preco_custo: number | null
          preco_venda: number | null
          unidade: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string
          codigo?: string | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          id?: string
          nome: string
          preco_custo?: number | null
          preco_venda?: number | null
          unidade?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          codigo?: string | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          id?: string
          nome?: string
          preco_custo?: number | null
          preco_venda?: number | null
          unidade?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "erpinfinity_produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "erpinfinity_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      erpinfinity_usuarios: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string
          empresa_id: string | null
          id: string
          nome: string
          papel: string | null
          senha: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email: string
          empresa_id?: string | null
          id?: string
          nome: string
          papel?: string | null
          senha: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          papel?: string | null
          senha?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "erpinfinity_usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "erpinfinity_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      erpinfinity_vendas: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          data_venda: string | null
          desconto: number | null
          empresa_id: string | null
          id: string
          numero_venda: string
          observacoes: string | null
          status: string | null
          updated_at: string | null
          usuario_id: string | null
          valor_total: number | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          data_venda?: string | null
          desconto?: number | null
          empresa_id?: string | null
          id?: string
          numero_venda: string
          observacoes?: string | null
          status?: string | null
          updated_at?: string | null
          usuario_id?: string | null
          valor_total?: number | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          data_venda?: string | null
          desconto?: number | null
          empresa_id?: string | null
          id?: string
          numero_venda?: string
          observacoes?: string | null
          status?: string | null
          updated_at?: string | null
          usuario_id?: string | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "erpinfinity_vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "erpinfinity_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "erpinfinity_vendas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "erpinfinity_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "erpinfinity_vendas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "erpinfinity_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      erpinfinity_vendas_itens: {
        Row: {
          created_at: string | null
          desconto: number | null
          id: string
          preco_unitario: number
          produto_id: string | null
          quantidade: number
          valor_total: number
          venda_id: string | null
        }
        Insert: {
          created_at?: string | null
          desconto?: number | null
          id?: string
          preco_unitario: number
          produto_id?: string | null
          quantidade: number
          valor_total: number
          venda_id?: string | null
        }
        Update: {
          created_at?: string | null
          desconto?: number | null
          id?: string
          preco_unitario?: number
          produto_id?: string | null
          quantidade?: number
          valor_total?: number
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "erpinfinity_vendas_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "erpinfinity_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "erpinfinity_vendas_itens_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "erpinfinity_vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      estudos_alunos: {
        Row: {
          created_at: string
          data_cadastro: string
          email: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_cadastro?: string
          email?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_cadastro?: string
          email?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      estudos_materias: {
        Row: {
          ativa: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      estudos_registros: {
        Row: {
          acertos: number
          aluno_id: string
          aluno_nome: string
          created_at: string
          data: string
          id: string
          materia: string
          percentual: number
          questoes: number
          updated_at: string
        }
        Insert: {
          acertos: number
          aluno_id: string
          aluno_nome: string
          created_at?: string
          data?: string
          id?: string
          materia: string
          percentual: number
          questoes: number
          updated_at?: string
        }
        Update: {
          acertos?: number
          aluno_id?: string
          aluno_nome?: string
          created_at?: string
          data?: string
          id?: string
          materia?: string
          percentual?: number
          questoes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estudos_registros_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "estudos_alunos"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_api_config: {
        Row: {
          api_key: string
          api_url: string
          created_at: string | null
          id: string
          instance_name: string
          updated_at: string | null
        }
        Insert: {
          api_key: string
          api_url: string
          created_at?: string | null
          id?: string
          instance_name: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string
          api_url?: string
          created_at?: string | null
          id?: string
          instance_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      evolution_contacts: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          telefone: string
          updated_at: string | null
          verificado: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          telefone: string
          updated_at?: string | null
          verificado?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          telefone?: string
          updated_at?: string | null
          verificado?: boolean | null
        }
        Relationships: []
      }
      evolution_groups: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          selected: boolean | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          selected?: boolean | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          selected?: boolean | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      financepro_consult_centros_custo: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
          orcamento: number | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          orcamento?: number | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          orcamento?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financepro_consult_centros_custo_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      financepro_consult_clientes: {
        Row: {
          ativo: boolean
          cep: string | null
          cidade: string | null
          cnpj_cpf: string | null
          created_at: string
          email: string | null
          empresa_id: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          total_a_receber: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          total_a_receber?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          total_a_receber?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financepro_consult_clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      financepro_consult_contas_pagar: {
        Row: {
          centro_custo_id: string | null
          conta_principal_id: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          desconto: number | null
          descricao: string
          eh_parcelado: boolean
          empresa_id: string | null
          fornecedor_id: string | null
          id: string
          juros: number | null
          multa: number | null
          numero_documento: string | null
          observacoes: string | null
          parcela_numero: number | null
          parcela_total: number | null
          plano_conta_id: string | null
          quantidade_parcelas: number | null
          status: string
          updated_at: string
          valor: number
          valor_pago: number | null
        }
        Insert: {
          centro_custo_id?: string | null
          conta_principal_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          desconto?: number | null
          descricao: string
          eh_parcelado?: boolean
          empresa_id?: string | null
          fornecedor_id?: string | null
          id?: string
          juros?: number | null
          multa?: number | null
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          plano_conta_id?: string | null
          quantidade_parcelas?: number | null
          status?: string
          updated_at?: string
          valor: number
          valor_pago?: number | null
        }
        Update: {
          centro_custo_id?: string | null
          conta_principal_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          desconto?: number | null
          descricao?: string
          eh_parcelado?: boolean
          empresa_id?: string | null
          fornecedor_id?: string | null
          id?: string
          juros?: number | null
          multa?: number | null
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          plano_conta_id?: string | null
          quantidade_parcelas?: number | null
          status?: string
          updated_at?: string
          valor?: number
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financepro_consult_contas_pagar_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_centros_custo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financepro_consult_contas_pagar_conta_principal_id_fkey"
            columns: ["conta_principal_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_contas_pagar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financepro_consult_contas_pagar_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financepro_consult_contas_pagar_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financepro_consult_contas_pagar_plano_conta_id_fkey"
            columns: ["plano_conta_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_plano_contas"
            referencedColumns: ["id"]
          },
        ]
      }
      financepro_consult_contas_receber: {
        Row: {
          centro_custo_id: string | null
          cliente_id: string | null
          conta_principal_id: string | null
          created_at: string
          data_recebimento: string | null
          data_vencimento: string
          desconto: number | null
          descricao: string
          eh_parcelado: boolean
          empresa_id: string | null
          id: string
          juros: number | null
          multa: number | null
          numero_documento: string | null
          observacoes: string | null
          parcela_numero: number | null
          parcela_total: number | null
          plano_conta_id: string | null
          quantidade_parcelas: number | null
          status: string
          updated_at: string
          valor: number
          valor_recebido: number | null
        }
        Insert: {
          centro_custo_id?: string | null
          cliente_id?: string | null
          conta_principal_id?: string | null
          created_at?: string
          data_recebimento?: string | null
          data_vencimento: string
          desconto?: number | null
          descricao: string
          eh_parcelado?: boolean
          empresa_id?: string | null
          id?: string
          juros?: number | null
          multa?: number | null
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          plano_conta_id?: string | null
          quantidade_parcelas?: number | null
          status?: string
          updated_at?: string
          valor: number
          valor_recebido?: number | null
        }
        Update: {
          centro_custo_id?: string | null
          cliente_id?: string | null
          conta_principal_id?: string | null
          created_at?: string
          data_recebimento?: string | null
          data_vencimento?: string
          desconto?: number | null
          descricao?: string
          eh_parcelado?: boolean
          empresa_id?: string | null
          id?: string
          juros?: number | null
          multa?: number | null
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          plano_conta_id?: string | null
          quantidade_parcelas?: number | null
          status?: string
          updated_at?: string
          valor?: number
          valor_recebido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financepro_consult_contas_receber_centro_custo_id_fkey"
            columns: ["centro_custo_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_centros_custo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financepro_consult_contas_receber_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financepro_consult_contas_receber_conta_principal_id_fkey"
            columns: ["conta_principal_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_contas_receber"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financepro_consult_contas_receber_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financepro_consult_contas_receber_plano_conta_id_fkey"
            columns: ["plano_conta_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_plano_contas"
            referencedColumns: ["id"]
          },
        ]
      }
      financepro_consult_empresas: {
        Row: {
          ativo: boolean
          cep: string | null
          cidade: string | null
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          logo_url: string | null
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      financepro_consult_fornecedores: {
        Row: {
          ativo: boolean
          cep: string | null
          cidade: string | null
          cnpj_cpf: string | null
          created_at: string
          email: string | null
          empresa_id: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          total_a_pagar: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          total_a_pagar?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          total_a_pagar?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financepro_consult_fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      financepro_consult_plano_contas: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          empresa_id: string | null
          grupo_id: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          empresa_id?: string | null
          grupo_id?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          empresa_id?: string | null
          grupo_id?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financepro_consult_plano_contas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financepro_consult_plano_contas_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_plano_contas_grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      financepro_consult_plano_contas_grupos: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          empresa_id: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          empresa_id?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financepro_consult_plano_contas_grupos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      financepro_consult_usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          empresa_id: string | null
          grupos_acesso: string[] | null
          id: string
          nome: string
          papel: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          empresa_id?: string | null
          grupos_acesso?: string[] | null
          id?: string
          nome: string
          papel?: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          empresa_id?: string | null
          grupos_acesso?: string[] | null
          id?: string
          nome?: string
          papel?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financepro_consult_usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "financepro_consult_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj_cpf: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      funcoes: {
        Row: {
          area: string | null
          created_at: string
          descricao: string
          id: string
          nome: string
        }
        Insert: {
          area?: string | null
          created_at?: string
          descricao: string
          id?: string
          nome: string
        }
        Update: {
          area?: string | null
          created_at?: string
          descricao?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      historico_alteracoes: {
        Row: {
          created_at: string | null
          id: number
          motivo_perda: string | null
          orcamento_id: number | null
          status_anterior: string | null
          status_novo: string
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          motivo_perda?: string | null
          orcamento_id?: number | null
          status_anterior?: string | null
          status_novo: string
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          motivo_perda?: string | null
          orcamento_id?: number | null
          status_anterior?: string | null
          status_novo?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_alteracoes_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "concrem_orcamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      incorporadora_casas: {
        Row: {
          comprador: string | null
          created_at: string
          data_venda: string | null
          id: string
          lote_id: string
          nome: string | null
          observacoes: string | null
          projeto_id: string
          status: string
          updated_at: string
          valor_venda: number | null
          vendida: boolean
        }
        Insert: {
          comprador?: string | null
          created_at?: string
          data_venda?: string | null
          id?: string
          lote_id: string
          nome?: string | null
          observacoes?: string | null
          projeto_id: string
          status?: string
          updated_at?: string
          valor_venda?: number | null
          vendida?: boolean
        }
        Update: {
          comprador?: string | null
          created_at?: string
          data_venda?: string | null
          id?: string
          lote_id?: string
          nome?: string | null
          observacoes?: string | null
          projeto_id?: string
          status?: string
          updated_at?: string
          valor_venda?: number | null
          vendida?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "incorporadora_casas_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "incorporadora_lotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incorporadora_casas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "incorporadora_projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      incorporadora_construcoes: {
        Row: {
          casa_id: string | null
          created_at: string
          data_conclusao: string | null
          data_inicio: string
          id: string
          lote_id: string
          percentual_total: number
          previsao_termino: string | null
          updated_at: string
        }
        Insert: {
          casa_id?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string
          id?: string
          lote_id: string
          percentual_total?: number
          previsao_termino?: string | null
          updated_at?: string
        }
        Update: {
          casa_id?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string
          id?: string
          lote_id?: string
          percentual_total?: number
          previsao_termino?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incorporadora_construcoes_casa_id_fkey"
            columns: ["casa_id"]
            isOneToOne: false
            referencedRelation: "incorporadora_casas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incorporadora_construcoes_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "incorporadora_lotes"
            referencedColumns: ["id"]
          },
        ]
      }
      incorporadora_etapas: {
        Row: {
          concluida: boolean
          construcao_id: string
          created_at: string
          data_conclusao: string | null
          eh_subetapa: boolean
          etapa_pai_id: string | null
          id: string
          nome: string
          observacoes: string | null
          ordem: number
          percentual_fim: number
          percentual_inicio: number
          updated_at: string
        }
        Insert: {
          concluida?: boolean
          construcao_id: string
          created_at?: string
          data_conclusao?: string | null
          eh_subetapa?: boolean
          etapa_pai_id?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          ordem?: number
          percentual_fim: number
          percentual_inicio: number
          updated_at?: string
        }
        Update: {
          concluida?: boolean
          construcao_id?: string
          created_at?: string
          data_conclusao?: string | null
          eh_subetapa?: boolean
          etapa_pai_id?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          ordem?: number
          percentual_fim?: number
          percentual_inicio?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incorporadora_etapas_construcao_id_fkey"
            columns: ["construcao_id"]
            isOneToOne: false
            referencedRelation: "incorporadora_construcoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incorporadora_etapas_etapa_pai_id_fkey"
            columns: ["etapa_pai_id"]
            isOneToOne: false
            referencedRelation: "incorporadora_etapas"
            referencedColumns: ["id"]
          },
        ]
      }
      incorporadora_lotes: {
        Row: {
          area: number
          created_at: string
          data_cadastro: string
          id: string
          localizacao: string
          numero: string
          observacoes: string | null
          status: string
          updated_at: string
          valor: number
          vendido: boolean
        }
        Insert: {
          area: number
          created_at?: string
          data_cadastro?: string
          id?: string
          localizacao: string
          numero: string
          observacoes?: string | null
          status?: string
          updated_at?: string
          valor?: number
          vendido?: boolean
        }
        Update: {
          area?: number
          created_at?: string
          data_cadastro?: string
          id?: string
          localizacao?: string
          numero?: string
          observacoes?: string | null
          status?: string
          updated_at?: string
          valor?: number
          vendido?: boolean
        }
        Relationships: []
      }
      incorporadora_projetos: {
        Row: {
          ativo: boolean
          comodos: Json | null
          created_at: string
          descricao: string | null
          fotos: string[] | null
          id: string
          metragem_construida: number
          nome: string
          updated_at: string
          valor_projeto: number
        }
        Insert: {
          ativo?: boolean
          comodos?: Json | null
          created_at?: string
          descricao?: string | null
          fotos?: string[] | null
          id?: string
          metragem_construida?: number
          nome: string
          updated_at?: string
          valor_projeto?: number
        }
        Update: {
          ativo?: boolean
          comodos?: Json | null
          created_at?: string
          descricao?: string | null
          fotos?: string[] | null
          id?: string
          metragem_construida?: number
          nome?: string
          updated_at?: string
          valor_projeto?: number
        }
        Relationships: []
      }
      instaladores_movimentacoes: {
        Row: {
          cliente_id: string | null
          conta_id: string
          created_at: string
          data_movimentacao: string
          id: string
          instalador_id: string
          observacoes: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          cliente_id?: string | null
          conta_id: string
          created_at?: string
          data_movimentacao?: string
          id?: string
          instalador_id: string
          observacoes?: string | null
          updated_at?: string
          valor: number
        }
        Update: {
          cliente_id?: string | null
          conta_id?: string
          created_at?: string
          data_movimentacao?: string
          id?: string
          instalador_id?: string
          observacoes?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "instaladores_movimentacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instaladores_movimentacoes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "instaladores_plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instaladores_movimentacoes_instalador_id_fkey"
            columns: ["instalador_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_instaladores"
            referencedColumns: ["id"]
          },
        ]
      }
      instaladores_plano_contas: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventario_contagens: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string
          departamento_id: string | null
          descricao: string
          empresa_id: string
          id: string
          numero_contagem: string
          observacoes: string | null
          responsavel_id: string
          secao_id: string | null
          status: string
          tipo_contagem: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio: string
          departamento_id?: string | null
          descricao: string
          empresa_id: string
          id?: string
          numero_contagem: string
          observacoes?: string | null
          responsavel_id: string
          secao_id?: string | null
          status?: string
          tipo_contagem?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          departamento_id?: string | null
          descricao?: string
          empresa_id?: string
          id?: string
          numero_contagem?: string
          observacoes?: string | null
          responsavel_id?: string
          secao_id?: string | null
          status?: string
          tipo_contagem?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventario_contagens_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "inventario_departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_contagens_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "inventario_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_contagens_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "inventario_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_contagens_secao_id_fkey"
            columns: ["secao_id"]
            isOneToOne: false
            referencedRelation: "inventario_secoes"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_departamentos: {
        Row: {
          ativo: boolean
          cor: string | null
          created_at: string
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cor?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cor?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventario_departamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "inventario_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_empresas: {
        Row: {
          ativo: boolean
          cep: string | null
          cidade: string | null
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventario_historico_contagens: {
        Row: {
          contagem_id: string
          created_at: string
          data_ajuste: string
          diferenca: number | null
          id: string
          motivo: string | null
          produto_id: string
          quantidade_anterior: number | null
          quantidade_nova: number | null
          usuario_id: string
          valor_diferenca: number | null
        }
        Insert: {
          contagem_id: string
          created_at?: string
          data_ajuste?: string
          diferenca?: number | null
          id?: string
          motivo?: string | null
          produto_id: string
          quantidade_anterior?: number | null
          quantidade_nova?: number | null
          usuario_id: string
          valor_diferenca?: number | null
        }
        Update: {
          contagem_id?: string
          created_at?: string
          data_ajuste?: string
          diferenca?: number | null
          id?: string
          motivo?: string | null
          produto_id?: string
          quantidade_anterior?: number | null
          quantidade_nova?: number | null
          usuario_id?: string
          valor_diferenca?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventario_historico_contagens_contagem_id_fkey"
            columns: ["contagem_id"]
            isOneToOne: false
            referencedRelation: "inventario_contagens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_historico_contagens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "inventario_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_historico_contagens_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "inventario_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_itens_contagem: {
        Row: {
          contador_id: string | null
          contagem_id: string
          created_at: string
          data_contagem: string | null
          diferenca: number | null
          id: string
          observacoes: string | null
          produto_id: string
          quantidade_contada: number | null
          quantidade_sistema: number | null
          status: string
          updated_at: string
          valor_total: number | null
          valor_unitario: number | null
        }
        Insert: {
          contador_id?: string | null
          contagem_id: string
          created_at?: string
          data_contagem?: string | null
          diferenca?: number | null
          id?: string
          observacoes?: string | null
          produto_id: string
          quantidade_contada?: number | null
          quantidade_sistema?: number | null
          status?: string
          updated_at?: string
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Update: {
          contador_id?: string | null
          contagem_id?: string
          created_at?: string
          data_contagem?: string | null
          diferenca?: number | null
          id?: string
          observacoes?: string | null
          produto_id?: string
          quantidade_contada?: number | null
          quantidade_sistema?: number | null
          status?: string
          updated_at?: string
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventario_itens_contagem_contador_id_fkey"
            columns: ["contador_id"]
            isOneToOne: false
            referencedRelation: "inventario_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_itens_contagem_contagem_id_fkey"
            columns: ["contagem_id"]
            isOneToOne: false
            referencedRelation: "inventario_contagens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_itens_contagem_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "inventario_produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_produtos: {
        Row: {
          ativo: boolean
          codigo: string
          codigo_barras: string | null
          created_at: string
          departamento_id: string
          descricao: string
          empresa_id: string
          estoque_maximo: number | null
          estoque_minimo: number | null
          id: string
          localizacao: string | null
          observacoes: string | null
          preco_custo: number | null
          preco_venda: number | null
          secao_id: string
          unidade_medida: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          codigo_barras?: string | null
          created_at?: string
          departamento_id: string
          descricao: string
          empresa_id: string
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          id?: string
          localizacao?: string | null
          observacoes?: string | null
          preco_custo?: number | null
          preco_venda?: number | null
          secao_id: string
          unidade_medida?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          codigo_barras?: string | null
          created_at?: string
          departamento_id?: string
          descricao?: string
          empresa_id?: string
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          id?: string
          localizacao?: string | null
          observacoes?: string | null
          preco_custo?: number | null
          preco_venda?: number | null
          secao_id?: string
          unidade_medida?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventario_produtos_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "inventario_departamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "inventario_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventario_produtos_secao_id_fkey"
            columns: ["secao_id"]
            isOneToOne: false
            referencedRelation: "inventario_secoes"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_secoes: {
        Row: {
          ativo: boolean
          created_at: string
          departamento_id: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          departamento_id: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          departamento_id?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventario_secoes_departamento_id_fkey"
            columns: ["departamento_id"]
            isOneToOne: false
            referencedRelation: "inventario_departamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario_usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          departamentos_acesso: string[] | null
          email: string
          empresa_id: string
          id: string
          nome: string
          papel: string
          senha: string
          ultimo_acesso: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          departamentos_acesso?: string[] | null
          email: string
          empresa_id: string
          id?: string
          nome: string
          papel?: string
          senha: string
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          departamentos_acesso?: string[] | null
          email?: string
          empresa_id?: string
          id?: string
          nome?: string
          papel?: string
          senha?: string
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventario_usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "inventario_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      leadsconcrem_acabamentos: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string
          id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao: string
          id?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      leadsconcrem_atendentes: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string
          id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao: string
          id?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      leadsconcrem_canais: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string
          id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao: string
          id?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      leadsconcrem_leads: {
        Row: {
          acabamento_id: string | null
          atendente_id: string | null
          canal_id: string | null
          cidade: string | null
          cnpj_fechado: string | null
          contato: string | null
          cpf_cnpj: string | null
          created_at: string
          data_chegada: string
          data_fechamento: string | null
          data_orcamento: string | null
          id: string
          nome_contato: string | null
          numero_orcamento: string | null
          numero_pedido: string | null
          obs_representantes: string | null
          observacoes: string | null
          publico_id: string | null
          quantidade: number | null
          ramo_id: string | null
          razao_social: string | null
          representante_id: string | null
          status_id: string | null
          tempo_fechamento: number | null
          uf: string | null
          updated_at: string
          valor_orcamento: number | null
        }
        Insert: {
          acabamento_id?: string | null
          atendente_id?: string | null
          canal_id?: string | null
          cidade?: string | null
          cnpj_fechado?: string | null
          contato?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          data_chegada: string
          data_fechamento?: string | null
          data_orcamento?: string | null
          id?: string
          nome_contato?: string | null
          numero_orcamento?: string | null
          numero_pedido?: string | null
          obs_representantes?: string | null
          observacoes?: string | null
          publico_id?: string | null
          quantidade?: number | null
          ramo_id?: string | null
          razao_social?: string | null
          representante_id?: string | null
          status_id?: string | null
          tempo_fechamento?: number | null
          uf?: string | null
          updated_at?: string
          valor_orcamento?: number | null
        }
        Update: {
          acabamento_id?: string | null
          atendente_id?: string | null
          canal_id?: string | null
          cidade?: string | null
          cnpj_fechado?: string | null
          contato?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          data_chegada?: string
          data_fechamento?: string | null
          data_orcamento?: string | null
          id?: string
          nome_contato?: string | null
          numero_orcamento?: string | null
          numero_pedido?: string | null
          obs_representantes?: string | null
          observacoes?: string | null
          publico_id?: string | null
          quantidade?: number | null
          ramo_id?: string | null
          razao_social?: string | null
          representante_id?: string | null
          status_id?: string | null
          tempo_fechamento?: number | null
          uf?: string | null
          updated_at?: string
          valor_orcamento?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leadsconcrem_leads_acabamento_id_fkey"
            columns: ["acabamento_id"]
            isOneToOne: false
            referencedRelation: "leadsconcrem_acabamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadsconcrem_leads_atendente_id_fkey"
            columns: ["atendente_id"]
            isOneToOne: false
            referencedRelation: "leadsconcrem_atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadsconcrem_leads_canal_id_fkey"
            columns: ["canal_id"]
            isOneToOne: false
            referencedRelation: "leadsconcrem_canais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadsconcrem_leads_publico_id_fkey"
            columns: ["publico_id"]
            isOneToOne: false
            referencedRelation: "leadsconcrem_publicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadsconcrem_leads_ramo_id_fkey"
            columns: ["ramo_id"]
            isOneToOne: false
            referencedRelation: "leadsconcrem_ramos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadsconcrem_leads_representante_id_fkey"
            columns: ["representante_id"]
            isOneToOne: false
            referencedRelation: "leadsconcrem_representantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leadsconcrem_leads_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "leadsconcrem_status"
            referencedColumns: ["id"]
          },
        ]
      }
      leadsconcrem_publicos: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string
          id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao: string
          id?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      leadsconcrem_ramos: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string
          id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao: string
          id?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      leadsconcrem_representantes: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string
          id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao: string
          id?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      leadsconcrem_status: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string
          id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao: string
          id?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      leadsconcrem_usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          id: string
          nome_completo: string
          papel: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          id?: string
          nome_completo: string
          papel?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          id?: string
          nome_completo?: string
          papel?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      logisticadist_cargas: {
        Row: {
          cliente_id: string | null
          created_at: string
          id: string
          numero_carga: string
          observacoes: string | null
          status: string
          total_alizares: number | null
          total_batentes: number | null
          total_kits: number | null
          total_portas: number | null
          total_valor_carga: number | null
          total_valor_frete: number | null
          updated_at: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          id?: string
          numero_carga: string
          observacoes?: string | null
          status?: string
          total_alizares?: number | null
          total_batentes?: number | null
          total_kits?: number | null
          total_portas?: number | null
          total_valor_carga?: number | null
          total_valor_frete?: number | null
          updated_at?: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          id?: string
          numero_carga?: string
          observacoes?: string | null
          status?: string
          total_alizares?: number | null
          total_batentes?: number | null
          total_kits?: number | null
          total_portas?: number | null
          total_valor_carga?: number | null
          total_valor_frete?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "logisticadist_cargas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "logisticadist_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      logisticadist_clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj_cpf: string | null
          contato_responsavel: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          contato_responsavel?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          contato_responsavel?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      logisticadist_configuracoes: {
        Row: {
          chave: string
          created_at: string | null
          id: number
          updated_at: string | null
          valor: string | null
        }
        Insert: {
          chave: string
          created_at?: string | null
          id?: number
          updated_at?: string | null
          valor?: string | null
        }
        Update: {
          chave?: string
          created_at?: string | null
          id?: number
          updated_at?: string | null
          valor?: string | null
        }
        Relationships: []
      }
      logisticadist_contatos: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: number
          name: string
          number: string
          type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          name: string
          number: string
          type: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          name?: string
          number?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      logisticadist_motoristas: {
        Row: {
          categoria_cnh: string | null
          cep: string | null
          cidade: string | null
          cnh: string | null
          cpf: string | null
          created_at: string
          data_admissao: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          rg: string | null
          salario: number | null
          status: string
          telefone: string | null
          updated_at: string
          vencimento_cnh: string | null
        }
        Insert: {
          categoria_cnh?: string | null
          cep?: string | null
          cidade?: string | null
          cnh?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          rg?: string | null
          salario?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
          vencimento_cnh?: string | null
        }
        Update: {
          categoria_cnh?: string | null
          cep?: string | null
          cidade?: string | null
          cnh?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          rg?: string | null
          salario?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
          vencimento_cnh?: string | null
        }
        Relationships: []
      }
      logisticadist_pedidos: {
        Row: {
          carga_id: string
          cidade: string | null
          cliente: string
          created_at: string
          id: string
          numero_pedido: string
          observacoes: string | null
          quantidade_alizares: number | null
          quantidade_batentes: number | null
          quantidade_kits: number | null
          quantidade_portas: number | null
          uf: string | null
          updated_at: string
          valor_carga: number
          valor_frete: number
        }
        Insert: {
          carga_id: string
          cidade?: string | null
          cliente: string
          created_at?: string
          id?: string
          numero_pedido: string
          observacoes?: string | null
          quantidade_alizares?: number | null
          quantidade_batentes?: number | null
          quantidade_kits?: number | null
          quantidade_portas?: number | null
          uf?: string | null
          updated_at?: string
          valor_carga?: number
          valor_frete?: number
        }
        Update: {
          carga_id?: string
          cidade?: string | null
          cliente?: string
          created_at?: string
          id?: string
          numero_pedido?: string
          observacoes?: string | null
          quantidade_alizares?: number | null
          quantidade_batentes?: number | null
          quantidade_kits?: number | null
          quantidade_portas?: number | null
          uf?: string | null
          updated_at?: string
          valor_carga?: number
          valor_frete?: number
        }
        Relationships: [
          {
            foreignKeyName: "logisticadist_pedidos_carga_id_fkey"
            columns: ["carga_id"]
            isOneToOne: false
            referencedRelation: "logisticadist_cargas"
            referencedColumns: ["id"]
          },
        ]
      }
      logisticadist_usuarios: {
        Row: {
          created_at: string
          data_ultimo_acesso: string | null
          email: string
          id: string
          nome: string
          perfil: string
          senha: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_ultimo_acesso?: string | null
          email: string
          id?: string
          nome: string
          perfil?: string
          senha: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_ultimo_acesso?: string | null
          email?: string
          id?: string
          nome?: string
          perfil?: string
          senha?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      logisticadist_veiculos: {
        Row: {
          ano: number | null
          capacidade_carga: number | null
          chassi: string | null
          cor: string | null
          created_at: string
          data_aquisicao: string | null
          id: string
          km_atual: number | null
          marca: string
          modelo: string
          observacoes: string | null
          placa: string
          renavam: string | null
          status: string
          tipo_veiculo: string
          updated_at: string
          valor_aquisicao: number | null
        }
        Insert: {
          ano?: number | null
          capacidade_carga?: number | null
          chassi?: string | null
          cor?: string | null
          created_at?: string
          data_aquisicao?: string | null
          id?: string
          km_atual?: number | null
          marca: string
          modelo: string
          observacoes?: string | null
          placa: string
          renavam?: string | null
          status?: string
          tipo_veiculo?: string
          updated_at?: string
          valor_aquisicao?: number | null
        }
        Update: {
          ano?: number | null
          capacidade_carga?: number | null
          chassi?: string | null
          cor?: string | null
          created_at?: string
          data_aquisicao?: string | null
          id?: string
          km_atual?: number | null
          marca?: string
          modelo?: string
          observacoes?: string | null
          placa?: string
          renavam?: string | null
          status?: string
          tipo_veiculo?: string
          updated_at?: string
          valor_aquisicao?: number | null
        }
        Relationships: []
      }
      logisticadist_viagens: {
        Row: {
          alimentacao: number | null
          arla: number | null
          carga_id: string | null
          chapa: number | null
          combustivel_litros: number | null
          comissao: number | null
          created_at: string
          data_fim: string | null
          data_inicio: string
          despesas_diversas: number | null
          destino: string
          estacionamento: number | null
          id: string
          impostos: number | null
          km_final: number | null
          km_inicial: number | null
          km_rodado: number | null
          manutencao: number | null
          media_km_l: number | null
          motorista_id: string | null
          numero_viagem: string
          observacoes: string | null
          origem: string
          outras_despesas: number | null
          pedagio: number | null
          percentual_comissao: number | null
          saldo_viagem: number | null
          status: string
          tipo_viagem: string | null
          total_despesas: number | null
          updated_at: string
          valor_combustivel: number | null
          valor_frete: number | null
          veiculo_id: string | null
        }
        Insert: {
          alimentacao?: number | null
          arla?: number | null
          carga_id?: string | null
          chapa?: number | null
          combustivel_litros?: number | null
          comissao?: number | null
          created_at?: string
          data_fim?: string | null
          data_inicio: string
          despesas_diversas?: number | null
          destino: string
          estacionamento?: number | null
          id?: string
          impostos?: number | null
          km_final?: number | null
          km_inicial?: number | null
          km_rodado?: number | null
          manutencao?: number | null
          media_km_l?: number | null
          motorista_id?: string | null
          numero_viagem: string
          observacoes?: string | null
          origem: string
          outras_despesas?: number | null
          pedagio?: number | null
          percentual_comissao?: number | null
          saldo_viagem?: number | null
          status?: string
          tipo_viagem?: string | null
          total_despesas?: number | null
          updated_at?: string
          valor_combustivel?: number | null
          valor_frete?: number | null
          veiculo_id?: string | null
        }
        Update: {
          alimentacao?: number | null
          arla?: number | null
          carga_id?: string | null
          chapa?: number | null
          combustivel_litros?: number | null
          comissao?: number | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          despesas_diversas?: number | null
          destino?: string
          estacionamento?: number | null
          id?: string
          impostos?: number | null
          km_final?: number | null
          km_inicial?: number | null
          km_rodado?: number | null
          manutencao?: number | null
          media_km_l?: number | null
          motorista_id?: string | null
          numero_viagem?: string
          observacoes?: string | null
          origem?: string
          outras_despesas?: number | null
          pedagio?: number | null
          percentual_comissao?: number | null
          saldo_viagem?: number | null
          status?: string
          tipo_viagem?: string | null
          total_despesas?: number | null
          updated_at?: string
          valor_combustivel?: number | null
          valor_frete?: number | null
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logisticadist_viagens_carga_id_fkey"
            columns: ["carga_id"]
            isOneToOne: false
            referencedRelation: "logisticadist_cargas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logisticadist_viagens_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "logisticadist_motoristas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logisticadist_viagens_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "logisticadist_veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacoes_bancarias: {
        Row: {
          conta_bancaria_id: string
          created_at: string
          data_movimentacao: string
          descricao: string
          documento: string | null
          id: string
          saldo_anterior: number
          saldo_posterior: number
          tipo_movimentacao: string
          updated_at: string
          valor: number
        }
        Insert: {
          conta_bancaria_id: string
          created_at?: string
          data_movimentacao: string
          descricao: string
          documento?: string | null
          id?: string
          saldo_anterior: number
          saldo_posterior: number
          tipo_movimentacao: string
          updated_at?: string
          valor: number
        }
        Update: {
          conta_bancaria_id?: string
          created_at?: string
          data_movimentacao?: string
          descricao?: string
          documento?: string | null
          id?: string
          saldo_anterior?: number
          saldo_posterior?: number
          tipo_movimentacao?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_bancarias_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
        ]
      }
      pacotes: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          descricao: string | null
          id: string
          nome: string
          valor_base: number | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome: string
          valor_base?: number | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          valor_base?: number | null
        }
        Relationships: []
      }
      paricaservices_clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj_cpf: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      paricaservices_contratos_instaladores: {
        Row: {
          agencia: string | null
          banco: string | null
          beneficiario: string | null
          chave_pix: string | null
          clausulas: Json | null
          conta_corrente: string | null
          contratada_cpf: string
          contratada_endereco: string | null
          contratada_estado_civil: string | null
          contratada_nacionalidade: string | null
          contratada_nome: string
          contratante_cnpj: string | null
          contratante_email: string | null
          contratante_endereco: string | null
          contratante_nome: string | null
          created_at: string | null
          data_fim: string
          data_inicio: string
          id: string
          remuneracao_mensal: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agencia?: string | null
          banco?: string | null
          beneficiario?: string | null
          chave_pix?: string | null
          clausulas?: Json | null
          conta_corrente?: string | null
          contratada_cpf: string
          contratada_endereco?: string | null
          contratada_estado_civil?: string | null
          contratada_nacionalidade?: string | null
          contratada_nome: string
          contratante_cnpj?: string | null
          contratante_email?: string | null
          contratante_endereco?: string | null
          contratante_nome?: string | null
          created_at?: string | null
          data_fim: string
          data_inicio: string
          id?: string
          remuneracao_mensal: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agencia?: string | null
          banco?: string | null
          beneficiario?: string | null
          chave_pix?: string | null
          clausulas?: Json | null
          conta_corrente?: string | null
          contratada_cpf?: string
          contratada_endereco?: string | null
          contratada_estado_civil?: string | null
          contratada_nacionalidade?: string | null
          contratada_nome?: string
          contratante_cnpj?: string | null
          contratante_email?: string | null
          contratante_endereco?: string | null
          contratante_nome?: string | null
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          id?: string
          remuneracao_mensal?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      paricaservices_estoque_categorias: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      paricaservices_estoque_entradas: {
        Row: {
          created_at: string
          custo_total: number
          custo_unitario: number
          data_entrada: string
          id: string
          observacoes: string | null
          produto_id: string
          quantidade: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          custo_total: number
          custo_unitario: number
          data_entrada?: string
          id?: string
          observacoes?: string | null
          produto_id: string
          quantidade: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          custo_total?: number
          custo_unitario?: number
          data_entrada?: string
          id?: string
          observacoes?: string | null
          produto_id?: string
          quantidade?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paricaservices_estoque_entradas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_estoque_produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      paricaservices_estoque_produtos: {
        Row: {
          ativo: boolean
          categoria_id: string | null
          created_at: string
          custo_medio: number
          id: string
          nome: string
          quantidade_estoque: number
          unidade_medida: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria_id?: string | null
          created_at?: string
          custo_medio?: number
          id?: string
          nome: string
          quantidade_estoque?: number
          unidade_medida?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria_id?: string | null
          created_at?: string
          custo_medio?: number
          id?: string
          nome?: string
          quantidade_estoque?: number
          unidade_medida?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paricaservices_estoque_produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_estoque_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      paricaservices_estoque_saidas: {
        Row: {
          created_at: string
          custo_medio_saida: number
          custo_total: number
          data_saida: string
          id: string
          observacoes: string | null
          produto_id: string
          quantidade: number
          updated_at: string
          venda_id: string
        }
        Insert: {
          created_at?: string
          custo_medio_saida: number
          custo_total: number
          data_saida?: string
          id?: string
          observacoes?: string | null
          produto_id: string
          quantidade: number
          updated_at?: string
          venda_id: string
        }
        Update: {
          created_at?: string
          custo_medio_saida?: number
          custo_total?: number
          data_saida?: string
          id?: string
          observacoes?: string | null
          produto_id?: string
          quantidade?: number
          updated_at?: string
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paricaservices_estoque_saidas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_estoque_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paricaservices_estoque_saidas_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      paricaservices_instalacoes: {
        Row: {
          cliente_id: string | null
          created_at: string
          data: string
          id: string
          instalador_id: string | null
          quantidade: number
          updated_at: string
          venda_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data: string
          id?: string
          instalador_id?: string | null
          quantidade: number
          updated_at?: string
          venda_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data?: string
          id?: string
          instalador_id?: string | null
          quantidade?: number
          updated_at?: string
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paricaservices_instalacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paricaservices_instalacoes_instalador_id_fkey"
            columns: ["instalador_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_instaladores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paricaservices_instalacoes_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      paricaservices_instaladores: {
        Row: {
          created_at: string
          email: string | null
          especialidade: string | null
          experiencia: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          especialidade?: string | null
          experiencia?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          especialidade?: string | null
          experiencia?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      paricaservices_orcamento_itens: {
        Row: {
          codigo: string | null
          created_at: string
          id: string
          orcamento_id: string
          produto: string
          quantidade: number
          updated_at: string
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          codigo?: string | null
          created_at?: string
          id?: string
          orcamento_id: string
          produto: string
          quantidade: number
          updated_at?: string
          valor_total: number
          valor_unitario: number
        }
        Update: {
          codigo?: string | null
          created_at?: string
          id?: string
          orcamento_id?: string
          produto?: string
          quantidade?: number
          updated_at?: string
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "paricaservices_orcamento_itens_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_orcamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      paricaservices_orcamentos: {
        Row: {
          cliente_id: string | null
          condicao_pagamento: string | null
          created_at: string
          data_emissao: string
          data_orcamento: string | null
          id: string
          numero_orcamento: number
          observacoes: string | null
          status: string
          updated_at: string
          validade_dias: number
          valor_total: number
          venda_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          condicao_pagamento?: string | null
          created_at?: string
          data_emissao?: string
          data_orcamento?: string | null
          id?: string
          numero_orcamento?: number
          observacoes?: string | null
          status?: string
          updated_at?: string
          validade_dias?: number
          valor_total?: number
          venda_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          condicao_pagamento?: string | null
          created_at?: string
          data_emissao?: string
          data_orcamento?: string | null
          id?: string
          numero_orcamento?: number
          observacoes?: string | null
          status?: string
          updated_at?: string
          validade_dias?: number
          valor_total?: number
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paricaservices_orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paricaservices_orcamentos_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      paricaservices_portas_instalacao: {
        Row: {
          andar: string
          apartamento: string
          created_at: string | null
          data_instalacao: string | null
          foto_url: string | null
          id: string
          instalador_id: string | null
          observacoes: string | null
          porta_nome: string | null
          status: string
          sub_status: string | null
          tipo_porta: string
          torre: string
          updated_at: string | null
          venda_id: string
        }
        Insert: {
          andar: string
          apartamento: string
          created_at?: string | null
          data_instalacao?: string | null
          foto_url?: string | null
          id?: string
          instalador_id?: string | null
          observacoes?: string | null
          porta_nome?: string | null
          status?: string
          sub_status?: string | null
          tipo_porta: string
          torre: string
          updated_at?: string | null
          venda_id: string
        }
        Update: {
          andar?: string
          apartamento?: string
          created_at?: string | null
          data_instalacao?: string | null
          foto_url?: string | null
          id?: string
          instalador_id?: string | null
          observacoes?: string | null
          porta_nome?: string | null
          status?: string
          sub_status?: string | null
          tipo_porta?: string
          torre?: string
          updated_at?: string | null
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paricaservices_portas_instalacao_instalador_id_fkey"
            columns: ["instalador_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_instaladores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paricaservices_portas_instalacao_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      paricaservices_produtos: {
        Row: {
          ativo: boolean
          categoria: string | null
          codigo: string | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          unidade: string | null
          updated_at: string
          valor_unitario: number
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          unidade?: string | null
          updated_at?: string
          valor_unitario?: number
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          unidade?: string | null
          updated_at?: string
          valor_unitario?: number
        }
        Relationships: []
      }
      paricaservices_unidades_instaladas: {
        Row: {
          andar: number | null
          created_at: string | null
          data_instalacao: string | null
          id: string
          instalador_id: string | null
          numero_unidade: number
          portas_instaladas: number | null
          status: string | null
          tipo_unidade: string
          torre: number | null
          updated_at: string | null
          venda_id: string
        }
        Insert: {
          andar?: number | null
          created_at?: string | null
          data_instalacao?: string | null
          id?: string
          instalador_id?: string | null
          numero_unidade: number
          portas_instaladas?: number | null
          status?: string | null
          tipo_unidade: string
          torre?: number | null
          updated_at?: string | null
          venda_id: string
        }
        Update: {
          andar?: number | null
          created_at?: string | null
          data_instalacao?: string | null
          id?: string
          instalador_id?: string | null
          numero_unidade?: number
          portas_instaladas?: number | null
          status?: string | null
          tipo_unidade?: string
          torre?: number | null
          updated_at?: string | null
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paricaservices_unidades_instaladas_instalador_id_fkey"
            columns: ["instalador_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_instaladores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paricaservices_unidades_instaladas_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      paricaservices_usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          email: string | null
          id: string
          nome: string
          papel: string
          senha: string
          telefone: string | null
          updated_at: string
          usuario: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          papel?: string
          senha: string
          telefone?: string | null
          updated_at?: string
          usuario: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          papel?: string
          senha?: string
          telefone?: string | null
          updated_at?: string
          usuario?: string
        }
        Relationships: []
      }
      paricaservices_vendas: {
        Row: {
          andares: number | null
          apartamentos_por_andar: number | null
          casas: number | null
          cidade: string
          cliente_id: string | null
          created_at: string
          data: string
          data_orcamento: string | null
          data_venda: string | null
          estado: string
          estrutura_config: Json | null
          id: string
          portas_por_apartamento: number | null
          portas_por_casa: number | null
          quantidade: number
          tipo_obra: string | null
          torres: number | null
          updated_at: string
          valor: number
        }
        Insert: {
          andares?: number | null
          apartamentos_por_andar?: number | null
          casas?: number | null
          cidade: string
          cliente_id?: string | null
          created_at?: string
          data?: string
          data_orcamento?: string | null
          data_venda?: string | null
          estado: string
          estrutura_config?: Json | null
          id?: string
          portas_por_apartamento?: number | null
          portas_por_casa?: number | null
          quantidade: number
          tipo_obra?: string | null
          torres?: number | null
          updated_at?: string
          valor: number
        }
        Update: {
          andares?: number | null
          apartamentos_por_andar?: number | null
          casas?: number | null
          cidade?: string
          cliente_id?: string | null
          created_at?: string
          data?: string
          data_orcamento?: string | null
          data_venda?: string | null
          estado?: string
          estrutura_config?: Json | null
          id?: string
          portas_por_apartamento?: number | null
          portas_por_casa?: number | null
          quantidade?: number
          tipo_obra?: string | null
          torres?: number | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "paricaservices_vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "paricaservices_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      plano_contas: {
        Row: {
          ativo: boolean
          conta: string
          created_at: string
          grupo: string
          id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          conta: string
          created_at?: string
          grupo: string
          id?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          conta?: string
          created_at?: string
          grupo?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativo: boolean | null
          created_at: string
          email: string | null
          id: string
          nome_completo: string | null
          papel: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          email?: string | null
          id: string
          nome_completo?: string | null
          papel?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          nome_completo?: string | null
          papel?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      questoes: {
        Row: {
          enunciado: string
          id: string
          opcoes: string[] | null
          resposta_correta: number | null
          teste_id: string
          tipo: Database["public"]["Enums"]["tipo_questao"]
        }
        Insert: {
          enunciado: string
          id?: string
          opcoes?: string[] | null
          resposta_correta?: number | null
          teste_id: string
          tipo: Database["public"]["Enums"]["tipo_questao"]
        }
        Update: {
          enunciado?: string
          id?: string
          opcoes?: string[] | null
          resposta_correta?: number | null
          teste_id?: string
          tipo?: Database["public"]["Enums"]["tipo_questao"]
        }
        Relationships: [
          {
            foreignKeyName: "questoes_teste_id_fkey"
            columns: ["teste_id"]
            isOneToOne: false
            referencedRelation: "testes"
            referencedColumns: ["id"]
          },
        ]
      }
      respostas_testes: {
        Row: {
          avaliador_id: string | null
          candidato_id: string
          comentario_avaliador: string | null
          created_at: string
          data_realizacao: string
          id: string
          nota: number | null
          respostas: Json
          teste_id: string
        }
        Insert: {
          avaliador_id?: string | null
          candidato_id: string
          comentario_avaliador?: string | null
          created_at?: string
          data_realizacao?: string
          id?: string
          nota?: number | null
          respostas: Json
          teste_id: string
        }
        Update: {
          avaliador_id?: string | null
          candidato_id?: string
          comentario_avaliador?: string | null
          created_at?: string
          data_realizacao?: string
          id?: string
          nota?: number | null
          respostas?: Json
          teste_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "respostas_testes_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_testes_teste_id_fkey"
            columns: ["teste_id"]
            isOneToOne: false
            referencedRelation: "testes"
            referencedColumns: ["id"]
          },
        ]
      }
      saldos_bancarios_historico: {
        Row: {
          conta_bancaria_id: string
          created_at: string
          data_saldo: string
          id: string
          observacoes: string | null
          saldo_valor: number
          updated_at: string
        }
        Insert: {
          conta_bancaria_id: string
          created_at?: string
          data_saldo: string
          id?: string
          observacoes?: string | null
          saldo_valor?: number
          updated_at?: string
        }
        Update: {
          conta_bancaria_id?: string
          created_at?: string
          data_saldo?: string
          id?: string
          observacoes?: string | null
          saldo_valor?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saldos_bancarios_historico_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
        ]
      }
      sante_agendamentos: {
        Row: {
          bairro: string | null
          cep: string | null
          cidade: string | null
          convenio: string | null
          cpf: string | null
          created_at: string
          data: string | null
          email: string | null
          especialidade: string | null
          id: string
          logradouro: string | null
          lote: string | null
          nascimento: string | null
          numero: string | null
          numero_carteira: string | null
          paciente: string | null
          presenca: string | null
          prestador: string | null
          primeira_vez: string | null
          prontuario: string | null
          quadra: string | null
          servico: string | null
          status: string | null
          unidade: string | null
          updated_at: string
          usuario: string | null
          valor: number | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          convenio?: string | null
          cpf?: string | null
          created_at?: string
          data?: string | null
          email?: string | null
          especialidade?: string | null
          id?: string
          logradouro?: string | null
          lote?: string | null
          nascimento?: string | null
          numero?: string | null
          numero_carteira?: string | null
          paciente?: string | null
          presenca?: string | null
          prestador?: string | null
          primeira_vez?: string | null
          prontuario?: string | null
          quadra?: string | null
          servico?: string | null
          status?: string | null
          unidade?: string | null
          updated_at?: string
          usuario?: string | null
          valor?: number | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          convenio?: string | null
          cpf?: string | null
          created_at?: string
          data?: string | null
          email?: string | null
          especialidade?: string | null
          id?: string
          logradouro?: string | null
          lote?: string | null
          nascimento?: string | null
          numero?: string | null
          numero_carteira?: string | null
          paciente?: string | null
          presenca?: string | null
          prestador?: string | null
          primeira_vez?: string | null
          prontuario?: string | null
          quadra?: string | null
          servico?: string | null
          status?: string | null
          unidade?: string | null
          updated_at?: string
          usuario?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      sante_despesas: {
        Row: {
          categoria: string | null
          categoria_principal: string | null
          cod: string | null
          created_at: string
          data_comp: string | null
          descricao: string | null
          dt_cad: string | null
          dt_pag: string | null
          dt_venc: string | null
          fornecedor: string | null
          id: string
          origem: string | null
          status: string | null
          updated_at: string
          vl_conta: number | null
          vl_pago: number | null
        }
        Insert: {
          categoria?: string | null
          categoria_principal?: string | null
          cod?: string | null
          created_at?: string
          data_comp?: string | null
          descricao?: string | null
          dt_cad?: string | null
          dt_pag?: string | null
          dt_venc?: string | null
          fornecedor?: string | null
          id?: string
          origem?: string | null
          status?: string | null
          updated_at?: string
          vl_conta?: number | null
          vl_pago?: number | null
        }
        Update: {
          categoria?: string | null
          categoria_principal?: string | null
          cod?: string | null
          created_at?: string
          data_comp?: string | null
          descricao?: string | null
          dt_cad?: string | null
          dt_pag?: string | null
          dt_venc?: string | null
          fornecedor?: string | null
          id?: string
          origem?: string | null
          status?: string | null
          updated_at?: string
          vl_conta?: number | null
          vl_pago?: number | null
        }
        Relationships: []
      }
      sante_evolution_config: {
        Row: {
          api_key: string
          api_url: string
          ativo: boolean
          created_at: string
          id: string
          instance_name: string
          updated_at: string
        }
        Insert: {
          api_key: string
          api_url: string
          ativo?: boolean
          created_at?: string
          id?: string
          instance_name: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          api_url?: string
          ativo?: boolean
          created_at?: string
          id?: string
          instance_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      sante_evolution_contacts: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          phone: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          phone: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          phone?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      sante_evolution_groups: {
        Row: {
          ativo: boolean
          created_at: string
          group_id: string
          group_name: string
          id: string
          selected: boolean
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          group_id: string
          group_name: string
          id?: string
          selected?: boolean
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          group_id?: string
          group_name?: string
          id?: string
          selected?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      sante_metas: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          id: string
          periodo: string
          tipo: string | null
          unidade: string
          updated_at: string
          valor: number
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          periodo: string
          tipo?: string | null
          unidade: string
          updated_at?: string
          valor: number
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          periodo?: string
          tipo?: string | null
          unidade?: string
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      sante_usuarios: {
        Row: {
          ativo: boolean
          auth_user_id: string | null
          created_at: string
          email: string
          id: string
          nome: string
          senha: string
          tipo_usuario: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          auth_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          nome: string
          senha: string
          tipo_usuario?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          auth_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string
          senha?: string
          tipo_usuario?: string
          updated_at?: string
        }
        Relationships: []
      }
      sante_vendas: {
        Row: {
          bandeira: string | null
          caixa: string | null
          cod: string | null
          cpf: string | null
          created_at: string
          data: string | null
          f_pagam: string | null
          hora: string | null
          id: string
          nfa: string | null
          paciente: string | null
          plano_saude: string | null
          prestador: string | null
          qtd_serv: number | null
          servico: string | null
          status: string | null
          terceiro: string | null
          unidade: string | null
          updated_at: string
          v_cobr: number | null
          v_desc: number | null
          v_rec: number | null
          v_serv: number | null
          v_total: number | null
          v_troco: number | null
        }
        Insert: {
          bandeira?: string | null
          caixa?: string | null
          cod?: string | null
          cpf?: string | null
          created_at?: string
          data?: string | null
          f_pagam?: string | null
          hora?: string | null
          id?: string
          nfa?: string | null
          paciente?: string | null
          plano_saude?: string | null
          prestador?: string | null
          qtd_serv?: number | null
          servico?: string | null
          status?: string | null
          terceiro?: string | null
          unidade?: string | null
          updated_at?: string
          v_cobr?: number | null
          v_desc?: number | null
          v_rec?: number | null
          v_serv?: number | null
          v_total?: number | null
          v_troco?: number | null
        }
        Update: {
          bandeira?: string | null
          caixa?: string | null
          cod?: string | null
          cpf?: string | null
          created_at?: string
          data?: string | null
          f_pagam?: string | null
          hora?: string | null
          id?: string
          nfa?: string | null
          paciente?: string | null
          plano_saude?: string | null
          prestador?: string | null
          qtd_serv?: number | null
          servico?: string | null
          status?: string | null
          terceiro?: string | null
          unidade?: string | null
          updated_at?: string
          v_cobr?: number | null
          v_desc?: number | null
          v_rec?: number | null
          v_serv?: number | null
          v_total?: number | null
          v_troco?: number | null
        }
        Relationships: []
      }
      sg_categorias_produtos: {
        Row: {
          ativo: boolean
          cor: string | null
          created_at: string
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cor?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cor?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_categorias_produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_clientes: {
        Row: {
          bairro: string | null
          categoria: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          created_at: string
          documento: string | null
          email: string | null
          empresa_id: string
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          numero: string | null
          observacoes: string | null
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          bairro?: string | null
          categoria?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          documento?: string | null
          email?: string | null
          empresa_id: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          numero?: string | null
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          bairro?: string | null
          categoria?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          documento?: string | null
          email?: string | null
          empresa_id?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          numero?: string | null
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_contas_pagar: {
        Row: {
          conta_id: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          descricao: string
          empresa_id: string
          fornecedor_id: string | null
          id: string
          numero_documento: string | null
          observacoes: string | null
          parcela_numero: number | null
          parcela_total: number | null
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          conta_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          descricao: string
          empresa_id: string
          fornecedor_id?: string | null
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          conta_id?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string
          empresa_id?: string
          fornecedor_id?: string | null
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "sg_contas_pagar_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "sg_plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_contas_pagar_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_contas_pagar_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "sg_fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_contas_receber: {
        Row: {
          cliente_id: string | null
          conta_id: string | null
          created_at: string
          data_recebimento: string | null
          data_vencimento: string
          descricao: string
          empresa_id: string
          id: string
          numero_documento: string | null
          observacoes: string | null
          parcela_numero: number | null
          parcela_total: number | null
          status: string
          updated_at: string
          valor: number
          venda_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          conta_id?: string | null
          created_at?: string
          data_recebimento?: string | null
          data_vencimento: string
          descricao: string
          empresa_id: string
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          status?: string
          updated_at?: string
          valor: number
          venda_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          conta_id?: string | null
          created_at?: string
          data_recebimento?: string | null
          data_vencimento?: string
          descricao?: string
          empresa_id?: string
          id?: string
          numero_documento?: string | null
          observacoes?: string | null
          parcela_numero?: number | null
          parcela_total?: number | null
          status?: string
          updated_at?: string
          valor?: number
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sg_contas_receber_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "sg_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_contas_receber_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "sg_plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_contas_receber_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_contas_receber_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "sg_vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_empresas: {
        Row: {
          ativo: boolean
          cep: string | null
          cidade: string | null
          cnpj: string | null
          cor: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          logo_url: string | null
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          cor?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          cor?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sg_formas_pagamento: {
        Row: {
          ativo: boolean
          created_at: string
          dias_recebimento: number | null
          empresa_id: string
          id: string
          nome: string
          parcelas_max: number | null
          taxa: number | null
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          dias_recebimento?: number | null
          empresa_id: string
          id?: string
          nome: string
          parcelas_max?: number | null
          taxa?: number | null
          tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          dias_recebimento?: number | null
          empresa_id?: string
          id?: string
          nome?: string
          parcelas_max?: number | null
          taxa?: number | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_formas_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_fornecedores: {
        Row: {
          bairro: string | null
          categoria: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          created_at: string
          documento: string | null
          email: string | null
          empresa_id: string
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          numero: string | null
          observacoes: string | null
          prazo_pagamento: number | null
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          bairro?: string | null
          categoria?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          documento?: string | null
          email?: string | null
          empresa_id: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          numero?: string | null
          observacoes?: string | null
          prazo_pagamento?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          bairro?: string | null
          categoria?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          documento?: string | null
          email?: string | null
          empresa_id?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          numero?: string | null
          observacoes?: string | null
          prazo_pagamento?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_itens_venda: {
        Row: {
          created_at: string
          desconto: number | null
          id: string
          preco_unitario: number
          produto_id: string
          quantidade: number
          valor_total: number
          venda_id: string
        }
        Insert: {
          created_at?: string
          desconto?: number | null
          id?: string
          preco_unitario: number
          produto_id: string
          quantidade: number
          valor_total: number
          venda_id: string
        }
        Update: {
          created_at?: string
          desconto?: number | null
          id?: string
          preco_unitario?: number
          produto_id?: string
          quantidade?: number
          valor_total?: number
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_itens_venda_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "sg_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_itens_venda_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "sg_vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_lancamentos: {
        Row: {
          categoria: string
          conta_id: string
          created_at: string
          data_lancamento: string
          descricao: string
          empresa_id: string
          id: string
          observacoes: string | null
          referencia: string | null
          tipo: string
          updated_at: string
          usuario_id: string
          valor: number
        }
        Insert: {
          categoria: string
          conta_id: string
          created_at?: string
          data_lancamento: string
          descricao: string
          empresa_id: string
          id?: string
          observacoes?: string | null
          referencia?: string | null
          tipo: string
          updated_at?: string
          usuario_id: string
          valor: number
        }
        Update: {
          categoria?: string
          conta_id?: string
          created_at?: string
          data_lancamento?: string
          descricao?: string
          empresa_id?: string
          id?: string
          observacoes?: string | null
          referencia?: string | null
          tipo?: string
          updated_at?: string
          usuario_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "sg_lancamentos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "sg_plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_lancamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_lancamentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "sg_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_metas_vendas: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          descricao: string | null
          empresa_id: string
          id: string
          meta_valor: number
          observacoes: string | null
          percentual_atingido: number | null
          periodo_ano: number
          periodo_mes: number
          status: string | null
          titulo: string
          updated_at: string
          valor_alcancado: number | null
          valor_meta: number
          valor_realizado: number | null
          vendedor_id: string | null
        }
        Insert: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          meta_valor: number
          observacoes?: string | null
          percentual_atingido?: number | null
          periodo_ano: number
          periodo_mes: number
          status?: string | null
          titulo?: string
          updated_at?: string
          valor_alcancado?: number | null
          valor_meta?: number
          valor_realizado?: number | null
          vendedor_id?: string | null
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          meta_valor?: number
          observacoes?: string | null
          percentual_atingido?: number | null
          periodo_ano?: number
          periodo_mes?: number
          status?: string | null
          titulo?: string
          updated_at?: string
          valor_alcancado?: number | null
          valor_meta?: number
          valor_realizado?: number | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sg_metas_vendas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_metas_vendas_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "sg_vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_movimentacoes_estoque: {
        Row: {
          created_at: string
          data_movimentacao: string
          documento: string | null
          empresa_id: string
          estoque_anterior: number
          estoque_posterior: number
          id: string
          motivo: string | null
          observacoes: string | null
          produto_id: string
          quantidade: number
          tipo_movimentacao: string
          usuario_id: string
          valor_unitario: number | null
        }
        Insert: {
          created_at?: string
          data_movimentacao?: string
          documento?: string | null
          empresa_id: string
          estoque_anterior: number
          estoque_posterior: number
          id?: string
          motivo?: string | null
          observacoes?: string | null
          produto_id: string
          quantidade: number
          tipo_movimentacao: string
          usuario_id: string
          valor_unitario?: number | null
        }
        Update: {
          created_at?: string
          data_movimentacao?: string
          documento?: string | null
          empresa_id?: string
          estoque_anterior?: number
          estoque_posterior?: number
          id?: string
          motivo?: string | null
          observacoes?: string | null
          produto_id?: string
          quantidade?: number
          tipo_movimentacao?: string
          usuario_id?: string
          valor_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sg_movimentacoes_estoque_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_movimentacoes_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "sg_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_movimentacoes_estoque_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "sg_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_plano_contas: {
        Row: {
          aceita_lancamento: boolean
          ativo: boolean
          categoria: string
          codigo: string
          conta_pai_id: string | null
          created_at: string
          empresa_id: string
          id: string
          nivel: number
          nome: string
          tipo: string
          updated_at: string
        }
        Insert: {
          aceita_lancamento?: boolean
          ativo?: boolean
          categoria: string
          codigo: string
          conta_pai_id?: string | null
          created_at?: string
          empresa_id: string
          id?: string
          nivel: number
          nome: string
          tipo: string
          updated_at?: string
        }
        Update: {
          aceita_lancamento?: boolean
          ativo?: boolean
          categoria?: string
          codigo?: string
          conta_pai_id?: string | null
          created_at?: string
          empresa_id?: string
          id?: string
          nivel?: number
          nome?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_plano_contas_conta_pai_id_fkey"
            columns: ["conta_pai_id"]
            isOneToOne: false
            referencedRelation: "sg_plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_plano_contas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_produtos: {
        Row: {
          ativo: boolean
          categoria_id: string | null
          codigo: string | null
          codigo_barras: string | null
          created_at: string
          descricao: string | null
          empresa_id: string
          estoque_atual: number | null
          estoque_maximo: number | null
          estoque_minimo: number | null
          id: string
          ncm: string | null
          nome: string
          peso: number | null
          preco_custo: number | null
          preco_venda: number | null
          unidade: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria_id?: string | null
          codigo?: string | null
          codigo_barras?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id: string
          estoque_atual?: number | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          id?: string
          ncm?: string | null
          nome: string
          peso?: number | null
          preco_custo?: number | null
          preco_venda?: number | null
          unidade?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria_id?: string | null
          codigo?: string | null
          codigo_barras?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          estoque_atual?: number | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          id?: string
          ncm?: string | null
          nome?: string
          peso?: number | null
          preco_custo?: number | null
          preco_venda?: number | null
          unidade?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "sg_categorias_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_usuarios: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          empresa_id: string | null
          id: string
          nome: string
          papel: string
          senha: string
          status: string
          ultimo_acesso: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          empresa_id?: string | null
          id?: string
          nome: string
          papel?: string
          senha: string
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          papel?: string
          senha?: string
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_vendas: {
        Row: {
          cliente_id: string
          created_at: string
          data_vencimento: string | null
          data_venda: string
          desconto_total: number | null
          empresa_id: string
          forma_pagamento_id: string | null
          id: string
          numero_venda: string
          observacoes: string | null
          parcelas: number | null
          status: string
          subtotal: number | null
          updated_at: string
          usuario_id: string
          valor_total: number | null
          vendedor_id: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_vencimento?: string | null
          data_venda?: string
          desconto_total?: number | null
          empresa_id: string
          forma_pagamento_id?: string | null
          id?: string
          numero_venda: string
          observacoes?: string | null
          parcelas?: number | null
          status?: string
          subtotal?: number | null
          updated_at?: string
          usuario_id: string
          valor_total?: number | null
          vendedor_id?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_vencimento?: string | null
          data_venda?: string
          desconto_total?: number | null
          empresa_id?: string
          forma_pagamento_id?: string | null
          id?: string
          numero_venda?: string
          observacoes?: string | null
          parcelas?: number | null
          status?: string
          subtotal?: number | null
          updated_at?: string
          usuario_id?: string
          valor_total?: number | null
          vendedor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sg_vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "sg_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_vendas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_vendas_forma_pagamento_id_fkey"
            columns: ["forma_pagamento_id"]
            isOneToOne: false
            referencedRelation: "sg_formas_pagamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_vendas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "sg_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_vendas_vendedor_id_fkey"
            columns: ["vendedor_id"]
            isOneToOne: false
            referencedRelation: "sg_vendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      sg_vendedores: {
        Row: {
          comissao: number | null
          created_at: string
          documento: string | null
          email: string | null
          empresa_id: string
          equipe: string | null
          id: string
          meta_alcancada: number | null
          meta_mensal: number | null
          nome: string
          status: string
          telefone: string | null
          territorio: string | null
          updated_at: string
          usuario_id: string
        }
        Insert: {
          comissao?: number | null
          created_at?: string
          documento?: string | null
          email?: string | null
          empresa_id: string
          equipe?: string | null
          id?: string
          meta_alcancada?: number | null
          meta_mensal?: number | null
          nome?: string
          status?: string
          telefone?: string | null
          territorio?: string | null
          updated_at?: string
          usuario_id: string
        }
        Update: {
          comissao?: number | null
          created_at?: string
          documento?: string | null
          email?: string | null
          empresa_id?: string
          equipe?: string | null
          id?: string
          meta_alcancada?: number | null
          meta_mensal?: number | null
          nome?: string
          status?: string
          telefone?: string | null
          territorio?: string | null
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sg_vendedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "sg_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sg_vendedores_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "sg_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sginfinity_categorias: {
        Row: {
          created_at: string | null
          data_criacao: string | null
          descricao: string | null
          id: number
          nome: string
          status: string
          tipo: string
          total_itens: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: number
          nome: string
          status?: string
          tipo: string
          total_itens?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: number
          nome?: string
          status?: string
          tipo?: string
          total_itens?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sginfinity_clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          cpf_cnpj: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: number
          nome: string
          status: string
          telefone: string | null
          tipo: string
          total_compras: number | null
          ultima_compra: string | null
          updated_at: string | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: number
          nome: string
          status?: string
          telefone?: string | null
          tipo?: string
          total_compras?: number | null
          ultima_compra?: string | null
          updated_at?: string | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: number
          nome?: string
          status?: string
          telefone?: string | null
          tipo?: string
          total_compras?: number | null
          ultima_compra?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sginfinity_contas_pagar: {
        Row: {
          created_at: string | null
          data_pagamento: string | null
          descricao: string
          fornecedor: string
          id: number
          observacoes: string | null
          status: string
          updated_at: string | null
          valor: number
          valor_pago: number | null
          vencimento: string
        }
        Insert: {
          created_at?: string | null
          data_pagamento?: string | null
          descricao: string
          fornecedor: string
          id?: number
          observacoes?: string | null
          status?: string
          updated_at?: string | null
          valor: number
          valor_pago?: number | null
          vencimento: string
        }
        Update: {
          created_at?: string | null
          data_pagamento?: string | null
          descricao?: string
          fornecedor?: string
          id?: number
          observacoes?: string | null
          status?: string
          updated_at?: string | null
          valor?: number
          valor_pago?: number | null
          vencimento?: string
        }
        Relationships: []
      }
      sginfinity_contas_receber: {
        Row: {
          cliente: string
          created_at: string | null
          data_recebimento: string | null
          descricao: string
          id: number
          observacoes: string | null
          status: string
          updated_at: string | null
          valor: number
          valor_recebido: number | null
          vencimento: string
        }
        Insert: {
          cliente: string
          created_at?: string | null
          data_recebimento?: string | null
          descricao: string
          id?: number
          observacoes?: string | null
          status?: string
          updated_at?: string | null
          valor: number
          valor_recebido?: number | null
          vencimento: string
        }
        Update: {
          cliente?: string
          created_at?: string | null
          data_recebimento?: string | null
          descricao?: string
          id?: number
          observacoes?: string | null
          status?: string
          updated_at?: string | null
          valor?: number
          valor_recebido?: number | null
          vencimento?: string
        }
        Relationships: []
      }
      sginfinity_fornecedores: {
        Row: {
          categoria: string | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          condicao_pagamento: string | null
          contato: string | null
          created_at: string | null
          data_contrato: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: number
          nome: string
          observacoes: string | null
          prazo_entrega: number | null
          status: string
          telefone: string | null
          total_compras: number | null
          ultima_compra: string | null
          updated_at: string | null
        }
        Insert: {
          categoria?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          condicao_pagamento?: string | null
          contato?: string | null
          created_at?: string | null
          data_contrato?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: number
          nome: string
          observacoes?: string | null
          prazo_entrega?: number | null
          status?: string
          telefone?: string | null
          total_compras?: number | null
          ultima_compra?: string | null
          updated_at?: string | null
        }
        Update: {
          categoria?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          condicao_pagamento?: string | null
          contato?: string | null
          created_at?: string | null
          data_contrato?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: number
          nome?: string
          observacoes?: string | null
          prazo_entrega?: number | null
          status?: string
          telefone?: string | null
          total_compras?: number | null
          ultima_compra?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sginfinity_metas: {
        Row: {
          created_at: string | null
          data_fim: string
          data_inicio: string
          id: number
          percentual: number | null
          periodo: string
          status: string
          updated_at: string | null
          valor_meta: number
          vendedor: string
          vendido_atual: number | null
        }
        Insert: {
          created_at?: string | null
          data_fim: string
          data_inicio: string
          id?: number
          percentual?: number | null
          periodo: string
          status?: string
          updated_at?: string | null
          valor_meta: number
          vendedor: string
          vendido_atual?: number | null
        }
        Update: {
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          id?: number
          percentual?: number | null
          periodo?: string
          status?: string
          updated_at?: string | null
          valor_meta?: number
          vendedor?: string
          vendido_atual?: number | null
        }
        Relationships: []
      }
      sginfinity_plano_contas: {
        Row: {
          ativa: boolean | null
          categoria: string | null
          codigo: string
          created_at: string | null
          id: string
          lancavel: boolean | null
          nivel: number
          nome: string
          pai: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativa?: boolean | null
          categoria?: string | null
          codigo: string
          created_at?: string | null
          id: string
          lancavel?: boolean | null
          nivel: number
          nome: string
          pai?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativa?: boolean | null
          categoria?: string | null
          codigo?: string
          created_at?: string | null
          id?: string
          lancavel?: boolean | null
          nivel?: number
          nome?: string
          pai?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sginfinity_plano_contas_pai_fkey"
            columns: ["pai"]
            isOneToOne: false
            referencedRelation: "sginfinity_plano_contas"
            referencedColumns: ["id"]
          },
        ]
      }
      sginfinity_produtos: {
        Row: {
          categoria: string | null
          codigo: string
          created_at: string | null
          data_cadastro: string | null
          descricao: string | null
          estoque: number | null
          estoque_maximo: number | null
          estoque_minimo: number | null
          fornecedor: string | null
          id: number
          localizacao: string | null
          marca: string | null
          modelo: string | null
          nome: string
          observacoes: string | null
          preco_compra: number | null
          preco_venda: number | null
          status: string
          ultima_movimentacao: string | null
          unidade: string | null
          updated_at: string | null
        }
        Insert: {
          categoria?: string | null
          codigo: string
          created_at?: string | null
          data_cadastro?: string | null
          descricao?: string | null
          estoque?: number | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          fornecedor?: string | null
          id?: number
          localizacao?: string | null
          marca?: string | null
          modelo?: string | null
          nome: string
          observacoes?: string | null
          preco_compra?: number | null
          preco_venda?: number | null
          status?: string
          ultima_movimentacao?: string | null
          unidade?: string | null
          updated_at?: string | null
        }
        Update: {
          categoria?: string | null
          codigo?: string
          created_at?: string | null
          data_cadastro?: string | null
          descricao?: string | null
          estoque?: number | null
          estoque_maximo?: number | null
          estoque_minimo?: number | null
          fornecedor?: string | null
          id?: number
          localizacao?: string | null
          marca?: string | null
          modelo?: string | null
          nome?: string
          observacoes?: string | null
          preco_compra?: number | null
          preco_venda?: number | null
          status?: string
          ultima_movimentacao?: string | null
          unidade?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sginfinity_usuarios: {
        Row: {
          created_at: string | null
          email: string
          id: number
          nome: string
          perfil: string
          status: string
          ultimo_acesso: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          nome: string
          perfil: string
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          nome?: string
          perfil?: string
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sginfinity_vendas: {
        Row: {
          cliente: string
          created_at: string | null
          data: string
          forma_pagamento: string
          id: number
          status: string
          updated_at: string | null
          valor: number
          vendedor: string
        }
        Insert: {
          cliente: string
          created_at?: string | null
          data?: string
          forma_pagamento: string
          id?: number
          status?: string
          updated_at?: string | null
          valor: number
          vendedor: string
        }
        Update: {
          cliente?: string
          created_at?: string | null
          data?: string
          forma_pagamento?: string
          id?: number
          status?: string
          updated_at?: string | null
          valor?: number
          vendedor?: string
        }
        Relationships: []
      }
      sginfinity_vendedores: {
        Row: {
          cargo: string | null
          comissao: number | null
          cpf: string | null
          created_at: string | null
          data_admissao: string | null
          email: string | null
          equipe: string | null
          id: number
          meta_mensal: number | null
          nome: string
          status: string
          telefone: string | null
          total_vendas: number | null
          updated_at: string | null
          venda_atual: number | null
        }
        Insert: {
          cargo?: string | null
          comissao?: number | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          email?: string | null
          equipe?: string | null
          id?: number
          meta_mensal?: number | null
          nome: string
          status?: string
          telefone?: string | null
          total_vendas?: number | null
          updated_at?: string | null
          venda_atual?: number | null
        }
        Update: {
          cargo?: string | null
          comissao?: number | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          email?: string | null
          equipe?: string | null
          id?: number
          meta_mensal?: number | null
          nome?: string
          status?: string
          telefone?: string | null
          total_vendas?: number | null
          updated_at?: string | null
          venda_atual?: number | null
        }
        Relationships: []
      }
      sistemainventarios_contagens: {
        Row: {
          created_at: string
          data_contagem: string
          id: string
          item_id: string
          observacoes: string | null
          quantidade: number
          usuario: string | null
        }
        Insert: {
          created_at?: string
          data_contagem?: string
          id?: string
          item_id: string
          observacoes?: string | null
          quantidade: number
          usuario?: string | null
        }
        Update: {
          created_at?: string
          data_contagem?: string
          id?: string
          item_id?: string
          observacoes?: string | null
          quantidade?: number
          usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sistemainventarios_contagens_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "sistemainventarios_itens"
            referencedColumns: ["id"]
          },
        ]
      }
      sistemainventarios_inventarios: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string
          descricao: string | null
          id: string
          nome: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          descricao?: string | null
          id?: string
          nome: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          descricao?: string | null
          id?: string
          nome?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sistemainventarios_itens: {
        Row: {
          created_at: string
          divergencia: number | null
          id: string
          inventario_id: string
          observacoes: string | null
          produto_id: string
          quantidade_contada: number | null
          quantidade_sistema: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          divergencia?: number | null
          id?: string
          inventario_id: string
          observacoes?: string | null
          produto_id: string
          quantidade_contada?: number | null
          quantidade_sistema?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          divergencia?: number | null
          id?: string
          inventario_id?: string
          observacoes?: string | null
          produto_id?: string
          quantidade_contada?: number | null
          quantidade_sistema?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sistemainventarios_itens_inventario_id_fkey"
            columns: ["inventario_id"]
            isOneToOne: false
            referencedRelation: "sistemainventarios_inventarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sistemainventarios_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "sistemainventarios_produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      sistemainventarios_produtos: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          descricao: string | null
          id: string
          inventario_id: string | null
          nome: string
          preco_custo: number | null
          quantidade_sistema: number | null
          unidade: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          descricao?: string | null
          id?: string
          inventario_id?: string | null
          nome: string
          preco_custo?: number | null
          quantidade_sistema?: number | null
          unidade?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          descricao?: string | null
          id?: string
          inventario_id?: string | null
          nome?: string
          preco_custo?: number | null
          quantidade_sistema?: number | null
          unidade?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sistemainventarios_produtos_inventario_id_fkey"
            columns: ["inventario_id"]
            isOneToOne: false
            referencedRelation: "sistemainventarios_inventarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sistemainventarios_usuarios: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          id: string
          nome: string
          senha_hash: string
          tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          id?: string
          nome: string
          senha_hash: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          id?: string
          nome?: string
          senha_hash?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      sitensdrones_clientes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_data: string | null
          image_height: number | null
          image_mime: string | null
          image_url: string | null
          image_width: number | null
          location: string | null
          name: string
          thumb_data: string | null
          thumb_mime: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_data?: string | null
          image_height?: number | null
          image_mime?: string | null
          image_url?: string | null
          image_width?: number | null
          location?: string | null
          name: string
          thumb_data?: string | null
          thumb_mime?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_data?: string | null
          image_height?: number | null
          image_mime?: string | null
          image_url?: string | null
          image_width?: number | null
          location?: string | null
          name?: string
          thumb_data?: string | null
          thumb_mime?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sitensdrones_produtos: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_data: string | null
          image_height: number | null
          image_mime: string | null
          image_url: string | null
          image_width: number | null
          name: string
          thumb_data: string | null
          thumb_mime: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_data?: string | null
          image_height?: number | null
          image_mime?: string | null
          image_url?: string | null
          image_width?: number | null
          name: string
          thumb_data?: string | null
          thumb_mime?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_data?: string | null
          image_height?: number | null
          image_mime?: string | null
          image_url?: string | null
          image_width?: number | null
          name?: string
          thumb_data?: string | null
          thumb_mime?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sitensdrones_user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["sitensdrones_app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["sitensdrones_app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["sitensdrones_app_role"]
          user_id?: string
        }
        Relationships: []
      }
      sitensdrones_usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      socios: {
        Row: {
          cep: string | null
          cidade: string | null
          cpf: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sollum_arquivos_ativos: {
        Row: {
          asset_id: string
          asset_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_primary: boolean | null
        }
        Insert: {
          asset_id: string
          asset_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_primary?: boolean | null
        }
        Update: {
          asset_id?: string
          asset_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_files_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_ativos_terceiros: {
        Row: {
          asset_tag: string
          contract_end_date: string | null
          contract_number: string | null
          contract_start_date: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          location_id: string | null
          monthly_cost: number | null
          name: string
          notes: string | null
          owner_contact: string | null
          owner_name: string
          responsible_party_id: string | null
          status: Database["public"]["Enums"]["asset_status"]
          updated_at: string | null
        }
        Insert: {
          asset_tag: string
          contract_end_date?: string | null
          contract_number?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          location_id?: string | null
          monthly_cost?: number | null
          name: string
          notes?: string | null
          owner_contact?: string | null
          owner_name: string
          responsible_party_id?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
        }
        Update: {
          asset_tag?: string
          contract_end_date?: string | null
          contract_number?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          location_id?: string | null
          monthly_cost?: number | null
          name?: string
          notes?: string | null
          owner_contact?: string | null
          owner_name?: string
          responsible_party_id?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "third_party_assets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "third_party_assets_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "sollum_localizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "third_party_assets_responsible_party_id_fkey"
            columns: ["responsible_party_id"]
            isOneToOne: false
            referencedRelation: "sollum_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_ativos_venda: {
        Row: {
          asking_price: number
          asset_tag: string
          buyer_contact: string | null
          buyer_name: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          listing_date: string
          minimum_price: number | null
          name: string
          notes: string | null
          original_asset_id: string | null
          original_asset_type: string
          sale_date: string | null
          sale_price: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          asking_price: number
          asset_tag: string
          buyer_contact?: string | null
          buyer_name?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          listing_date: string
          minimum_price?: number | null
          name: string
          notes?: string | null
          original_asset_id?: string | null
          original_asset_type: string
          sale_date?: string | null
          sale_price?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          asking_price?: number
          asset_tag?: string
          buyer_contact?: string | null
          buyer_name?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          listing_date?: string
          minimum_price?: number | null
          name?: string
          notes?: string | null
          original_asset_id?: string | null
          original_asset_type?: string
          sale_date?: string | null
          sale_price?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_for_sale_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_classificacoes_contabeis: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounting_classifications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounting_classifications_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "sollum_classificacoes_contabeis"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_grupos_mobiliario: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          depreciation_rate: number | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string | null
          useful_life_years: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          depreciation_rate?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string | null
          useful_life_years?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          depreciation_rate?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string | null
          useful_life_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "furniture_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_imoveis: {
        Row: {
          accounting_classification_id: string | null
          address: string
          area_m2: number | null
          asset_tag: string
          built_area_m2: number | null
          city: string
          conservation_state: Database["public"]["Enums"]["conservation_state"]
          created_at: string | null
          created_by: string | null
          current_value: number | null
          id: string
          name: string
          notes: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          purchase_date: string | null
          purchase_value: number | null
          registration_number: string | null
          responsible_party_id: string | null
          state: string
          status: Database["public"]["Enums"]["asset_status"]
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          accounting_classification_id?: string | null
          address: string
          area_m2?: number | null
          asset_tag: string
          built_area_m2?: number | null
          city: string
          conservation_state?: Database["public"]["Enums"]["conservation_state"]
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          id?: string
          name: string
          notes?: string | null
          property_type: Database["public"]["Enums"]["property_type"]
          purchase_date?: string | null
          purchase_value?: number | null
          registration_number?: string | null
          responsible_party_id?: string | null
          state: string
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          accounting_classification_id?: string | null
          address?: string
          area_m2?: number | null
          asset_tag?: string
          built_area_m2?: number | null
          city?: string
          conservation_state?: Database["public"]["Enums"]["conservation_state"]
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          id?: string
          name?: string
          notes?: string | null
          property_type?: Database["public"]["Enums"]["property_type"]
          purchase_date?: string | null
          purchase_value?: number | null
          registration_number?: string | null
          responsible_party_id?: string | null
          state?: string
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "real_estate_accounting_classification_id_fkey"
            columns: ["accounting_classification_id"]
            isOneToOne: false
            referencedRelation: "sollum_classificacoes_contabeis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "real_estate_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "real_estate_responsible_party_id_fkey"
            columns: ["responsible_party_id"]
            isOneToOne: false
            referencedRelation: "sollum_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_incidentes_veiculos: {
        Row: {
          created_at: string | null
          created_by: string | null
          damage_cost: number | null
          description: string
          id: string
          incident_date: string
          incident_type: Database["public"]["Enums"]["incident_type"]
          insurance_claim_number: string | null
          is_resolved: boolean
          location: string | null
          resolution_date: string | null
          resolution_notes: string | null
          severity: Database["public"]["Enums"]["incident_severity"]
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          damage_cost?: number | null
          description: string
          id?: string
          incident_date: string
          incident_type: Database["public"]["Enums"]["incident_type"]
          insurance_claim_number?: string | null
          is_resolved?: boolean
          location?: string | null
          resolution_date?: string | null
          resolution_notes?: string | null
          severity: Database["public"]["Enums"]["incident_severity"]
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          damage_cost?: number | null
          description?: string
          id?: string
          incident_date?: string
          incident_type?: Database["public"]["Enums"]["incident_type"]
          insurance_claim_number?: string | null
          is_resolved?: boolean
          location?: string | null
          resolution_date?: string | null
          resolution_notes?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_incidents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_incidents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "sollum_veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_localizacoes: {
        Row: {
          address: string | null
          city: string | null
          code: string
          country: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code: string
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "sollum_localizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_log_auditoria: {
        Row: {
          action: string
          changed_fields: string[] | null
          created_at: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_fields?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_fields?: string[] | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_mobiliario: {
        Row: {
          accounting_classification_id: string | null
          asset_tag: string
          brand: string | null
          conservation_state: Database["public"]["Enums"]["conservation_state"]
          created_at: string | null
          created_by: string | null
          current_value: number | null
          description: string | null
          furniture_group_id: string | null
          id: string
          location_id: string | null
          model: string | null
          name: string
          notes: string | null
          purchase_date: string | null
          purchase_value: number | null
          responsible_party_id: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["asset_status"]
          updated_at: string | null
          warranty_end_date: string | null
        }
        Insert: {
          accounting_classification_id?: string | null
          asset_tag: string
          brand?: string | null
          conservation_state?: Database["public"]["Enums"]["conservation_state"]
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          furniture_group_id?: string | null
          id?: string
          location_id?: string | null
          model?: string | null
          name: string
          notes?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          responsible_party_id?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
          warranty_end_date?: string | null
        }
        Update: {
          accounting_classification_id?: string | null
          asset_tag?: string
          brand?: string | null
          conservation_state?: Database["public"]["Enums"]["conservation_state"]
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          furniture_group_id?: string | null
          id?: string
          location_id?: string | null
          model?: string | null
          name?: string
          notes?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          responsible_party_id?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
          warranty_end_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "furniture_accounting_classification_id_fkey"
            columns: ["accounting_classification_id"]
            isOneToOne: false
            referencedRelation: "sollum_classificacoes_contabeis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "furniture_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "furniture_furniture_group_id_fkey"
            columns: ["furniture_group_id"]
            isOneToOne: false
            referencedRelation: "sollum_grupos_mobiliario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "furniture_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "sollum_localizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "furniture_responsible_party_id_fkey"
            columns: ["responsible_party_id"]
            isOneToOne: false
            referencedRelation: "sollum_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_responsaveis: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          department: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          position: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          position?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responsible_parties_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_seguros_veiculos: {
        Row: {
          coverage_type: string | null
          created_at: string | null
          created_by: string | null
          deductible_value: number | null
          end_date: string
          id: string
          insurance_company: string
          is_active: boolean
          policy_number: string
          premium_value: number | null
          start_date: string
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          coverage_type?: string | null
          created_at?: string | null
          created_by?: string | null
          deductible_value?: number | null
          end_date: string
          id?: string
          insurance_company: string
          is_active?: boolean
          policy_number: string
          premium_value?: number | null
          start_date: string
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          coverage_type?: string | null
          created_at?: string | null
          created_by?: string | null
          deductible_value?: number | null
          end_date?: string
          id?: string
          insurance_company?: string
          is_active?: boolean
          policy_number?: string
          premium_value?: number | null
          start_date?: string
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_insurance_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_insurance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "sollum_veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      sollum_usuarios: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          senha: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          full_name: string
          id: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          senha?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          senha?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sollum_veiculos: {
        Row: {
          accounting_classification_id: string | null
          asset_tag: string
          brand: string
          chassis: string | null
          color: string | null
          conservation_state: Database["public"]["Enums"]["conservation_state"]
          created_at: string | null
          created_by: string | null
          current_value: number | null
          engine_capacity: number | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          license_plate: string | null
          location_id: string | null
          mileage: number | null
          model: string
          notes: string | null
          purchase_date: string | null
          purchase_value: number | null
          renavam: string | null
          responsible_party_id: string | null
          status: Database["public"]["Enums"]["asset_status"]
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: number
        }
        Insert: {
          accounting_classification_id?: string | null
          asset_tag: string
          brand: string
          chassis?: string | null
          color?: string | null
          conservation_state?: Database["public"]["Enums"]["conservation_state"]
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          engine_capacity?: number | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id?: string
          license_plate?: string | null
          location_id?: string | null
          mileage?: number | null
          model: string
          notes?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          renavam?: string | null
          responsible_party_id?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: number
        }
        Update: {
          accounting_classification_id?: string | null
          asset_tag?: string
          brand?: string
          chassis?: string | null
          color?: string | null
          conservation_state?: Database["public"]["Enums"]["conservation_state"]
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          engine_capacity?: number | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          license_plate?: string | null
          location_id?: string | null
          mileage?: number | null
          model?: string
          notes?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          renavam?: string | null
          responsible_party_id?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_accounting_classification_id_fkey"
            columns: ["accounting_classification_id"]
            isOneToOne: false
            referencedRelation: "sollum_classificacoes_contabeis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sollum_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "sollum_localizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_responsible_party_id_fkey"
            columns: ["responsible_party_id"]
            isOneToOne: false
            referencedRelation: "sollum_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      sucena_clientes: {
        Row: {
          atualizado_em: string | null
          cidade: string | null
          cnpj: string | null
          criado_em: string | null
          estado: string | null
          id: string
          nome: string
          razao_social: string | null
          status: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cidade?: string | null
          cnpj?: string | null
          criado_em?: string | null
          estado?: string | null
          id?: string
          nome: string
          razao_social?: string | null
          status?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cidade?: string | null
          cnpj?: string | null
          criado_em?: string | null
          estado?: string | null
          id?: string
          nome?: string
          razao_social?: string | null
          status?: string | null
        }
        Relationships: []
      }
      sucena_fornecedores: {
        Row: {
          atualizado_em: string | null
          cnpj: string
          criado_em: string | null
          email: string
          endereco: Json
          id: string
          nome: string
          pessoa_contato: string
          status: string
          telefone: string
          tipo: string
        }
        Insert: {
          atualizado_em?: string | null
          cnpj: string
          criado_em?: string | null
          email: string
          endereco: Json
          id?: string
          nome: string
          pessoa_contato: string
          status?: string
          telefone: string
          tipo: string
        }
        Update: {
          atualizado_em?: string | null
          cnpj?: string
          criado_em?: string | null
          email?: string
          endereco?: Json
          id?: string
          nome?: string
          pessoa_contato?: string
          status?: string
          telefone?: string
          tipo?: string
        }
        Relationships: []
      }
      sucena_motoristas: {
        Row: {
          atualizado_em: string | null
          cnh_categoria: string | null
          cnh_numero: string | null
          cnh_url: string | null
          cnh_validade: string | null
          cpf: string
          criado_em: string | null
          id: string
          localizacao_atual: string | null
          nome: string
          outros_documentos_url: string | null
          status: string
          veiculo_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cnh_categoria?: string | null
          cnh_numero?: string | null
          cnh_url?: string | null
          cnh_validade?: string | null
          cpf: string
          criado_em?: string | null
          id?: string
          localizacao_atual?: string | null
          nome: string
          outros_documentos_url?: string | null
          status?: string
          veiculo_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cnh_categoria?: string | null
          cnh_numero?: string | null
          cnh_url?: string | null
          cnh_validade?: string | null
          cpf?: string
          criado_em?: string | null
          id?: string
          localizacao_atual?: string | null
          nome?: string
          outros_documentos_url?: string | null
          status?: string
          veiculo_id?: string | null
        }
        Relationships: []
      }
      sucena_obras: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          cep: string | null
          cidade: string
          cliente_id: string | null
          codigo: string
          criado_em: string | null
          data_fim_prevista: string | null
          data_fim_real: string | null
          data_inicio: string | null
          descricao: string | null
          email_contato: string | null
          endereco: string | null
          estado: string
          id: string
          nome: string
          observacoes: string | null
          orcamento: number | null
          pacote_id: string | null
          progresso: number | null
          responsavel_tecnico: string | null
          status: string | null
          telefone_contato: string | null
          tipo_obra_id: string | null
          valor_gasto: number | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cep?: string | null
          cidade: string
          cliente_id?: string | null
          codigo: string
          criado_em?: string | null
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio?: string | null
          descricao?: string | null
          email_contato?: string | null
          endereco?: string | null
          estado: string
          id?: string
          nome: string
          observacoes?: string | null
          orcamento?: number | null
          pacote_id?: string | null
          progresso?: number | null
          responsavel_tecnico?: string | null
          status?: string | null
          telefone_contato?: string | null
          tipo_obra_id?: string | null
          valor_gasto?: number | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cep?: string | null
          cidade?: string
          cliente_id?: string | null
          codigo?: string
          criado_em?: string | null
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio?: string | null
          descricao?: string | null
          email_contato?: string | null
          endereco?: string | null
          estado?: string
          id?: string
          nome?: string
          observacoes?: string | null
          orcamento?: number | null
          pacote_id?: string | null
          progresso?: number | null
          responsavel_tecnico?: string | null
          status?: string | null
          telefone_contato?: string | null
          tipo_obra_id?: string | null
          valor_gasto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "obras_pacote_id_fkey"
            columns: ["pacote_id"]
            isOneToOne: false
            referencedRelation: "pacotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obras_tipo_obra_id_fkey"
            columns: ["tipo_obra_id"]
            isOneToOne: false
            referencedRelation: "tipos_obra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sucena_obras_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "sucena_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      sucena_paginas: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          categoria: string
          criado_em: string | null
          descricao: string | null
          id: string
          nome: string
          url: string
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          categoria: string
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome: string
          url: string
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          categoria?: string
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          url?: string
        }
        Relationships: []
      }
      sucena_permissoes_perfil: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          id: string
          pagina_id: string
          perfil: string
          pode_editar: boolean | null
          pode_visualizar: boolean | null
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          pagina_id: string
          perfil: string
          pode_editar?: boolean | null
          pode_visualizar?: boolean | null
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          pagina_id?: string
          perfil?: string
          pode_editar?: boolean | null
          pode_visualizar?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "sucena_permissoes_perfil_pagina_id_fkey"
            columns: ["pagina_id"]
            isOneToOne: false
            referencedRelation: "sucena_paginas"
            referencedColumns: ["id"]
          },
        ]
      }
      sucena_permissoes_usuario: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          id: string
          pagina_id: string
          pode_editar: boolean | null
          pode_visualizar: boolean | null
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          pagina_id: string
          pode_editar?: boolean | null
          pode_visualizar?: boolean | null
          usuario_id: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          pagina_id?: string
          pode_editar?: boolean | null
          pode_visualizar?: boolean | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sucena_permissoes_usuario_pagina_id_fkey"
            columns: ["pagina_id"]
            isOneToOne: false
            referencedRelation: "sucena_paginas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sucena_permissoes_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "sucena_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sucena_permissoes_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios_view"
            referencedColumns: ["id"]
          },
        ]
      }
      sucena_usuarios: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          email: string
          id: string
          nome: string
          perfil: string
          senha_hash: string
          status: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          email: string
          id?: string
          nome: string
          perfil: string
          senha_hash: string
          status?: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          email?: string
          id?: string
          nome?: string
          perfil?: string
          senha_hash?: string
          status?: string
        }
        Relationships: []
      }
      sucena_veiculos: {
        Row: {
          ano: number
          atualizado_em: string | null
          chassi: string | null
          combustivel: Database["public"]["Enums"]["combustivel_tipo"]
          cor: string
          criado_em: string | null
          crlv_url: string | null
          data_fim_contrato: string | null
          data_inicio_contrato: string | null
          documentos_ok: boolean
          fornecedor_id: string | null
          foto_veiculo_url: string | null
          id: string
          localizacao_atual: string | null
          marca: string
          modelo: string
          motorista_atual_id: string | null
          motorista_id: string | null
          nota_fiscal_url: string | null
          obra_atual_id: string | null
          placa: string
          plano_manutencao_url: string | null
          proxima_manutencao: string | null
          status: string
          status_docs: string
          tag: string | null
          tipo_propriedade: string
          tipo_veiculo_id: string | null
        }
        Insert: {
          ano: number
          atualizado_em?: string | null
          chassi?: string | null
          combustivel?: Database["public"]["Enums"]["combustivel_tipo"]
          cor: string
          criado_em?: string | null
          crlv_url?: string | null
          data_fim_contrato?: string | null
          data_inicio_contrato?: string | null
          documentos_ok?: boolean
          fornecedor_id?: string | null
          foto_veiculo_url?: string | null
          id?: string
          localizacao_atual?: string | null
          marca: string
          modelo: string
          motorista_atual_id?: string | null
          motorista_id?: string | null
          nota_fiscal_url?: string | null
          obra_atual_id?: string | null
          placa: string
          plano_manutencao_url?: string | null
          proxima_manutencao?: string | null
          status?: string
          status_docs?: string
          tag?: string | null
          tipo_propriedade?: string
          tipo_veiculo_id?: string | null
        }
        Update: {
          ano?: number
          atualizado_em?: string | null
          chassi?: string | null
          combustivel?: Database["public"]["Enums"]["combustivel_tipo"]
          cor?: string
          criado_em?: string | null
          crlv_url?: string | null
          data_fim_contrato?: string | null
          data_inicio_contrato?: string | null
          documentos_ok?: boolean
          fornecedor_id?: string | null
          foto_veiculo_url?: string | null
          id?: string
          localizacao_atual?: string | null
          marca?: string
          modelo?: string
          motorista_atual_id?: string | null
          motorista_id?: string | null
          nota_fiscal_url?: string | null
          obra_atual_id?: string | null
          placa?: string
          plano_manutencao_url?: string | null
          proxima_manutencao?: string | null
          status?: string
          status_docs?: string
          tag?: string | null
          tipo_propriedade?: string
          tipo_veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sucena_veiculos_obra_atual"
            columns: ["obra_atual_id"]
            isOneToOne: false
            referencedRelation: "obras_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sucena_veiculos_obra_atual"
            columns: ["obra_atual_id"]
            isOneToOne: false
            referencedRelation: "sucena_obras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sucena_veiculos_tipo_veiculo"
            columns: ["tipo_veiculo_id"]
            isOneToOne: false
            referencedRelation: "tipos_veiculo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sucena_veiculos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "sucena_fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      testehub_candidatos: {
        Row: {
          cpf: string | null
          created_at: string
          email: string
          funcao_id: string
          id: string
          nome: string
          status: Database["public"]["Enums"]["testehub_status_candidato"]
          teste_id: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          email: string
          funcao_id: string
          id?: string
          nome: string
          status?: Database["public"]["Enums"]["testehub_status_candidato"]
          teste_id?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string
          email?: string
          funcao_id?: string
          id?: string
          nome?: string
          status?: Database["public"]["Enums"]["testehub_status_candidato"]
          teste_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testehub_candidatos_funcao_id_fkey"
            columns: ["funcao_id"]
            isOneToOne: false
            referencedRelation: "testehub_funcoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testehub_candidatos_teste_id_fkey"
            columns: ["teste_id"]
            isOneToOne: false
            referencedRelation: "testehub_testes"
            referencedColumns: ["id"]
          },
        ]
      }
      testehub_funcoes: {
        Row: {
          area: string | null
          created_at: string
          descricao: string
          id: string
          nome: string
        }
        Insert: {
          area?: string | null
          created_at?: string
          descricao: string
          id?: string
          nome: string
        }
        Update: {
          area?: string | null
          created_at?: string
          descricao?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      testehub_profiles: {
        Row: {
          created_at: string
          id: string
          nome: string
          papel: Database["public"]["Enums"]["testehub_papel_usuario"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          papel?: Database["public"]["Enums"]["testehub_papel_usuario"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          papel?: Database["public"]["Enums"]["testehub_papel_usuario"]
          user_id?: string
        }
        Relationships: []
      }
      testehub_questoes: {
        Row: {
          enunciado: string
          id: string
          opcoes: string[] | null
          resposta_correta: number | null
          teste_id: string
          tipo: Database["public"]["Enums"]["testehub_tipo_questao"]
        }
        Insert: {
          enunciado: string
          id?: string
          opcoes?: string[] | null
          resposta_correta?: number | null
          teste_id: string
          tipo: Database["public"]["Enums"]["testehub_tipo_questao"]
        }
        Update: {
          enunciado?: string
          id?: string
          opcoes?: string[] | null
          resposta_correta?: number | null
          teste_id?: string
          tipo?: Database["public"]["Enums"]["testehub_tipo_questao"]
        }
        Relationships: [
          {
            foreignKeyName: "testehub_questoes_teste_id_fkey"
            columns: ["teste_id"]
            isOneToOne: false
            referencedRelation: "testehub_testes"
            referencedColumns: ["id"]
          },
        ]
      }
      testehub_respostas_testes: {
        Row: {
          avaliador_id: string | null
          candidato_id: string
          comentario_avaliador: string | null
          created_at: string
          data_realizacao: string
          id: string
          nota: number | null
          respostas: Json
          teste_id: string
        }
        Insert: {
          avaliador_id?: string | null
          candidato_id: string
          comentario_avaliador?: string | null
          created_at?: string
          data_realizacao?: string
          id?: string
          nota?: number | null
          respostas: Json
          teste_id: string
        }
        Update: {
          avaliador_id?: string | null
          candidato_id?: string
          comentario_avaliador?: string | null
          created_at?: string
          data_realizacao?: string
          id?: string
          nota?: number | null
          respostas?: Json
          teste_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testehub_respostas_testes_candidato_id_fkey"
            columns: ["candidato_id"]
            isOneToOne: false
            referencedRelation: "testehub_candidatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testehub_respostas_testes_teste_id_fkey"
            columns: ["teste_id"]
            isOneToOne: false
            referencedRelation: "testehub_testes"
            referencedColumns: ["id"]
          },
        ]
      }
      testehub_testes: {
        Row: {
          ativo: boolean
          data_criacao: string
          duracao: number
          funcao_id: string
          id: string
          nome: string
          tipo_teste_id: string
        }
        Insert: {
          ativo?: boolean
          data_criacao?: string
          duracao: number
          funcao_id: string
          id?: string
          nome: string
          tipo_teste_id: string
        }
        Update: {
          ativo?: boolean
          data_criacao?: string
          duracao?: number
          funcao_id?: string
          id?: string
          nome?: string
          tipo_teste_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testehub_testes_funcao_id_fkey"
            columns: ["funcao_id"]
            isOneToOne: false
            referencedRelation: "testehub_funcoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testehub_testes_tipo_teste_id_fkey"
            columns: ["tipo_teste_id"]
            isOneToOne: false
            referencedRelation: "testehub_tipos_testes"
            referencedColumns: ["id"]
          },
        ]
      }
      testehub_tipos_testes: {
        Row: {
          created_at: string
          descricao: string
          id: string
          instrucoes: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          instrucoes: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          instrucoes?: string
          nome?: string
        }
        Relationships: []
      }
      testes: {
        Row: {
          ativo: boolean
          data_criacao: string
          duracao: number
          funcao_id: string
          id: string
          nome: string
          tipo_teste_id: string
        }
        Insert: {
          ativo?: boolean
          data_criacao?: string
          duracao: number
          funcao_id: string
          id?: string
          nome: string
          tipo_teste_id: string
        }
        Update: {
          ativo?: boolean
          data_criacao?: string
          duracao?: number
          funcao_id?: string
          id?: string
          nome?: string
          tipo_teste_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testes_funcao_id_fkey"
            columns: ["funcao_id"]
            isOneToOne: false
            referencedRelation: "funcoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testes_tipo_teste_id_fkey"
            columns: ["tipo_teste_id"]
            isOneToOne: false
            referencedRelation: "tipos_testes"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_licencas: {
        Row: {
          categoria: string | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          obrigatoria: boolean | null
          status: string | null
          updated_at: string | null
          validade_padrao_meses: number | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          obrigatoria?: boolean | null
          status?: string | null
          updated_at?: string | null
          validade_padrao_meses?: number | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          obrigatoria?: boolean | null
          status?: string | null
          updated_at?: string | null
          validade_padrao_meses?: number | null
        }
        Relationships: []
      }
      tipos_obra: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      tipos_testes: {
        Row: {
          created_at: string
          descricao: string
          id: string
          instrucoes: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          instrucoes: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          instrucoes?: string
          nome?: string
        }
        Relationships: []
      }
      tipos_veiculo: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          criado_em: string | null
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      uniaotransportes_adiantamentos: {
        Row: {
          created_at: string
          data_adiantamento: string
          data_pagamento: string | null
          finalidade: string
          forma_pagamento: string | null
          id: string
          motorista_id: string
          observacoes: string | null
          status: string
          updated_at: string
          valor: number
          viagem_id: string | null
        }
        Insert: {
          created_at?: string
          data_adiantamento?: string
          data_pagamento?: string | null
          finalidade: string
          forma_pagamento?: string | null
          id?: string
          motorista_id: string
          observacoes?: string | null
          status?: string
          updated_at?: string
          valor: number
          viagem_id?: string | null
        }
        Update: {
          created_at?: string
          data_adiantamento?: string
          data_pagamento?: string | null
          finalidade?: string
          forma_pagamento?: string | null
          id?: string
          motorista_id?: string
          observacoes?: string | null
          status?: string
          updated_at?: string
          valor?: number
          viagem_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uniaotransportes_adiantamentos_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "uniaotransportes_motoristas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uniaotransportes_adiantamentos_viagem_id_fkey"
            columns: ["viagem_id"]
            isOneToOne: false
            referencedRelation: "uniaotransportes_viagens"
            referencedColumns: ["id"]
          },
        ]
      }
      uniaotransportes_clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          cnpj_cpf: string | null
          contato_responsavel: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          inscricao_estadual: string | null
          nome: string
          observacoes: string | null
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          contato_responsavel?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          nome: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cnpj_cpf?: string | null
          contato_responsavel?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          inscricao_estadual?: string | null
          nome?: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      uniaotransportes_configuracoes: {
        Row: {
          chave: string
          created_at: string
          descricao: string | null
          id: string
          tipo: string
          updated_at: string
          valor: string | null
        }
        Insert: {
          chave: string
          created_at?: string
          descricao?: string | null
          id?: string
          tipo?: string
          updated_at?: string
          valor?: string | null
        }
        Update: {
          chave?: string
          created_at?: string
          descricao?: string | null
          id?: string
          tipo?: string
          updated_at?: string
          valor?: string | null
        }
        Relationships: []
      }
      uniaotransportes_fechamentos: {
        Row: {
          combustivel_litros: number
          combustivel_media: number | null
          combustivel_valor: number
          comissao_motorista: number
          created_at: string
          data_fechamento: string
          despesa_estacionamento: number | null
          despesa_manutencao: number | null
          despesa_outros: number | null
          despesa_pedagio: number | null
          id: string
          km_final: number
          km_inicial: number
          km_percorrido: number | null
          observacoes: string | null
          saldo_viagem: number
          updated_at: string
          valor_frete_viagem: number
          viagem_id: string
        }
        Insert: {
          combustivel_litros: number
          combustivel_media?: number | null
          combustivel_valor: number
          comissao_motorista: number
          created_at?: string
          data_fechamento?: string
          despesa_estacionamento?: number | null
          despesa_manutencao?: number | null
          despesa_outros?: number | null
          despesa_pedagio?: number | null
          id?: string
          km_final: number
          km_inicial: number
          km_percorrido?: number | null
          observacoes?: string | null
          saldo_viagem: number
          updated_at?: string
          valor_frete_viagem: number
          viagem_id: string
        }
        Update: {
          combustivel_litros?: number
          combustivel_media?: number | null
          combustivel_valor?: number
          comissao_motorista?: number
          created_at?: string
          data_fechamento?: string
          despesa_estacionamento?: number | null
          despesa_manutencao?: number | null
          despesa_outros?: number | null
          despesa_pedagio?: number | null
          id?: string
          km_final?: number
          km_inicial?: number
          km_percorrido?: number | null
          observacoes?: string | null
          saldo_viagem?: number
          updated_at?: string
          valor_frete_viagem?: number
          viagem_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uniaotransportes_fechamentos_viagem_id_fkey"
            columns: ["viagem_id"]
            isOneToOne: false
            referencedRelation: "uniaotransportes_viagens"
            referencedColumns: ["id"]
          },
        ]
      }
      uniaotransportes_materiais: {
        Row: {
          categoria: string | null
          codigo: string | null
          created_at: string
          densidade: number | null
          descricao: string | null
          id: string
          nome: string
          preco_unitario: number | null
          status: string
          unidade: string
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          codigo?: string | null
          created_at?: string
          densidade?: number | null
          descricao?: string | null
          id?: string
          nome: string
          preco_unitario?: number | null
          status?: string
          unidade?: string
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          codigo?: string | null
          created_at?: string
          densidade?: number | null
          descricao?: string | null
          id?: string
          nome?: string
          preco_unitario?: number | null
          status?: string
          unidade?: string
          updated_at?: string
        }
        Relationships: []
      }
      uniaotransportes_motoristas: {
        Row: {
          categoria_cnh: string | null
          cep: string | null
          cidade: string | null
          cnh: string | null
          cpf: string | null
          created_at: string
          data_admissao: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          rg: string | null
          salario: number | null
          status: string
          telefone: string | null
          updated_at: string
          vencimento_cnh: string | null
        }
        Insert: {
          categoria_cnh?: string | null
          cep?: string | null
          cidade?: string | null
          cnh?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          rg?: string | null
          salario?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
          vencimento_cnh?: string | null
        }
        Update: {
          categoria_cnh?: string | null
          cep?: string | null
          cidade?: string | null
          cnh?: string | null
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          rg?: string | null
          salario?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
          vencimento_cnh?: string | null
        }
        Relationships: []
      }
      uniaotransportes_reembolsos: {
        Row: {
          aprovado_por: string | null
          created_at: string
          data_aprovacao: string | null
          data_pagamento: string | null
          data_solicitacao: string
          descricao: string
          id: string
          motorista_id: string
          numero_nota_fiscal: string | null
          observacoes: string | null
          status: string
          tipo_despesa: string
          updated_at: string
          valor: number
          viagem_id: string | null
        }
        Insert: {
          aprovado_por?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_pagamento?: string | null
          data_solicitacao?: string
          descricao: string
          id?: string
          motorista_id: string
          numero_nota_fiscal?: string | null
          observacoes?: string | null
          status?: string
          tipo_despesa: string
          updated_at?: string
          valor: number
          viagem_id?: string | null
        }
        Update: {
          aprovado_por?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_pagamento?: string | null
          data_solicitacao?: string
          descricao?: string
          id?: string
          motorista_id?: string
          numero_nota_fiscal?: string | null
          observacoes?: string | null
          status?: string
          tipo_despesa?: string
          updated_at?: string
          valor?: number
          viagem_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uniaotransportes_reembolsos_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "uniaotransportes_motoristas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uniaotransportes_reembolsos_viagem_id_fkey"
            columns: ["viagem_id"]
            isOneToOne: false
            referencedRelation: "uniaotransportes_viagens"
            referencedColumns: ["id"]
          },
        ]
      }
      uniaotransportes_usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          papel: string
          senha: string
          status: string
          ultimo_acesso: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          papel?: string
          senha: string
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          papel?: string
          senha?: string
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      uniaotransportes_veiculos: {
        Row: {
          ano: number | null
          capacidade_carga: number | null
          chassi: string | null
          cor: string | null
          created_at: string
          data_aquisicao: string | null
          id: string
          km_atual: number | null
          marca: string
          modelo: string
          observacoes: string | null
          placa: string
          renavam: string | null
          status: string
          tipo_veiculo: string
          updated_at: string
          valor_aquisicao: number | null
        }
        Insert: {
          ano?: number | null
          capacidade_carga?: number | null
          chassi?: string | null
          cor?: string | null
          created_at?: string
          data_aquisicao?: string | null
          id?: string
          km_atual?: number | null
          marca: string
          modelo: string
          observacoes?: string | null
          placa: string
          renavam?: string | null
          status?: string
          tipo_veiculo?: string
          updated_at?: string
          valor_aquisicao?: number | null
        }
        Update: {
          ano?: number | null
          capacidade_carga?: number | null
          chassi?: string | null
          cor?: string | null
          created_at?: string
          data_aquisicao?: string | null
          id?: string
          km_atual?: number | null
          marca?: string
          modelo?: string
          observacoes?: string | null
          placa?: string
          renavam?: string | null
          status?: string
          tipo_veiculo?: string
          updated_at?: string
          valor_aquisicao?: number | null
        }
        Relationships: []
      }
      uniaotransportes_viagens: {
        Row: {
          cliente_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string
          destino: string
          id: string
          km_final: number | null
          km_inicial: number | null
          material_id: string | null
          motorista_id: string | null
          numero_viagem: string
          observacoes: string | null
          origem: string
          percentual_comissao: number
          quantidade_material: number | null
          status: string
          updated_at: string
          valor_frete: number | null
          veiculo_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio: string
          destino: string
          id?: string
          km_final?: number | null
          km_inicial?: number | null
          material_id?: string | null
          motorista_id?: string | null
          numero_viagem: string
          observacoes?: string | null
          origem: string
          percentual_comissao?: number
          quantidade_material?: number | null
          status?: string
          updated_at?: string
          valor_frete?: number | null
          veiculo_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          destino?: string
          id?: string
          km_final?: number | null
          km_inicial?: number | null
          material_id?: string | null
          motorista_id?: string | null
          numero_viagem?: string
          observacoes?: string | null
          origem?: string
          percentual_comissao?: number
          quantidade_material?: number | null
          status?: string
          updated_at?: string
          valor_frete?: number | null
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uniaotransportes_viagens_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "uniaotransportes_clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uniaotransportes_viagens_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "uniaotransportes_materiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uniaotransportes_viagens_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "uniaotransportes_motoristas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uniaotransportes_viagens_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "uniaotransportes_veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      usuarios_empresas: {
        Row: {
          created_at: string
          empresa_id: string
          id: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          empresa_id: string
          id?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          empresa_id?: string
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_empresas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_empresas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios_sistema"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios_modulos: {
        Row: {
          created_at: string
          id: string
          modulo_key: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          modulo_key: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          id?: string
          modulo_key?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_modulos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios_sistema"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios_sistema: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          papel: string
          senha: string
          updated_at: string
          usuario: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          papel?: string
          senha: string
          updated_at?: string
          usuario: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          papel?: string
          senha?: string
          updated_at?: string
          usuario?: string
        }
        Relationships: []
      }
      veiculo_licencas: {
        Row: {
          arquivo_url: string | null
          created_at: string | null
          data_emissao: string | null
          data_execucao: string | null
          data_vencimento: string | null
          horimetro_atual: number | null
          id: string
          numero: string
          observacoes: string | null
          orgao_emissor: string
          proximo_horimetro: number | null
          status: string | null
          tipo_licenca_id: string
          updated_at: string | null
          veiculo_id: string
        }
        Insert: {
          arquivo_url?: string | null
          created_at?: string | null
          data_emissao?: string | null
          data_execucao?: string | null
          data_vencimento?: string | null
          horimetro_atual?: number | null
          id?: string
          numero: string
          observacoes?: string | null
          orgao_emissor: string
          proximo_horimetro?: number | null
          status?: string | null
          tipo_licenca_id: string
          updated_at?: string | null
          veiculo_id: string
        }
        Update: {
          arquivo_url?: string | null
          created_at?: string | null
          data_emissao?: string | null
          data_execucao?: string | null
          data_vencimento?: string | null
          horimetro_atual?: number | null
          id?: string
          numero?: string
          observacoes?: string | null
          orgao_emissor?: string
          proximo_horimetro?: number | null
          status?: string | null
          tipo_licenca_id?: string
          updated_at?: string | null
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "veiculo_licencas_tipo_licenca_id_fkey"
            columns: ["tipo_licenca_id"]
            isOneToOne: false
            referencedRelation: "tipos_licencas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veiculo_licencas_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "sucena_veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      vendas: {
        Row: {
          cliente_id: string
          created_at: string
          data_venda: string
          empresa_id: string
          id: string
          observacoes: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_venda: string
          empresa_id: string
          id?: string
          observacoes?: string | null
          updated_at?: string
          valor?: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_venda?: string
          empresa_id?: string
          id?: string
          observacoes?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vendas_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_vendas_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      vendeu_clientes_acesso: {
        Row: {
          ativo: boolean
          atualizado_em: string
          criado_em: string
          empresa_id: string
          id: string
          perfil_id: string | null
          responsavel_id: string | null
          senha_acesso_hash: string
          ultimo_acesso: string | null
          usuario_acesso: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          empresa_id: string
          id?: string
          perfil_id?: string | null
          responsavel_id?: string | null
          senha_acesso_hash: string
          ultimo_acesso?: string | null
          usuario_acesso: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          empresa_id?: string
          id?: string
          perfil_id?: string | null
          responsavel_id?: string | null
          senha_acesso_hash?: string
          ultimo_acesso?: string | null
          usuario_acesso?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendeu_clientes_acesso_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vendeu_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_clientes_acesso_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "vendeu_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_clientes_acesso_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "vendeu_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      vendeu_configuracoes: {
        Row: {
          atualizado_em: string | null
          chave: string
          criado_em: string | null
          descricao: string | null
          id: string
          tipo: string
          valor: string | null
        }
        Insert: {
          atualizado_em?: string | null
          chave: string
          criado_em?: string | null
          descricao?: string | null
          id?: string
          tipo?: string
          valor?: string | null
        }
        Update: {
          atualizado_em?: string | null
          chave?: string
          criado_em?: string | null
          descricao?: string | null
          id?: string
          tipo?: string
          valor?: string | null
        }
        Relationships: []
      }
      vendeu_documentos: {
        Row: {
          aprovado_por: string | null
          arquivo_url: string | null
          atualizado_em: string
          criado_em: string
          criado_por: string | null
          data_aprovacao: string | null
          data_upload: string
          descricao: string | null
          empresa_id: string | null
          id: string
          observacoes_aprovacao: string | null
          projeto_id: string | null
          reuniao_id: string | null
          status: string
          tipo_documento: string
          titulo: string
        }
        Insert: {
          aprovado_por?: string | null
          arquivo_url?: string | null
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          data_aprovacao?: string | null
          data_upload?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          observacoes_aprovacao?: string | null
          projeto_id?: string | null
          reuniao_id?: string | null
          status?: string
          tipo_documento?: string
          titulo: string
        }
        Update: {
          aprovado_por?: string | null
          arquivo_url?: string | null
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          data_aprovacao?: string | null
          data_upload?: string
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          observacoes_aprovacao?: string | null
          projeto_id?: string | null
          reuniao_id?: string | null
          status?: string
          tipo_documento?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendeu_documentos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "vendeu_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_documentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vendeu_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_documentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vendeu_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_documentos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vendeu_projetos_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_documentos_reuniao_id_fkey"
            columns: ["reuniao_id"]
            isOneToOne: false
            referencedRelation: "vendeu_reunioes"
            referencedColumns: ["id"]
          },
        ]
      }
      vendeu_empresas: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          descricao: string | null
          id: string
          logo_url: string | null
          nome: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          logo_url?: string | null
          nome: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          descricao?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
        }
        Relationships: []
      }
      vendeu_empresas_acessos: {
        Row: {
          created_at: string
          empresa_id: string
          id: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          empresa_id: string
          id?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          empresa_id?: string
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendeu_empresas_acessos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vendeu_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_empresas_acessos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "vendeu_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      vendeu_modelos_projetos: {
        Row: {
          ativo: boolean
          atualizado_em: string
          criado_em: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      vendeu_modelos_tarefas: {
        Row: {
          atualizado_em: string
          criado_em: string
          descricao: string | null
          id: string
          modelo_id: string
          nome: string
          ordem: number
          prazo_dias: number | null
          prioridade: string
          responsavel_id: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          modelo_id: string
          nome: string
          ordem?: number
          prazo_dias?: number | null
          prioridade?: string
          responsavel_id?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          modelo_id?: string
          nome?: string
          ordem?: number
          prazo_dias?: number | null
          prioridade?: string
          responsavel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendeu_modelos_tarefas_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "vendeu_modelos_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_modelos_tarefas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "vendeu_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      vendeu_perfis: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          permissoes: Json
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          permissoes?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          permissoes?: Json
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendeu_projetos: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
          responsavel_id: string | null
          status: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          responsavel_id?: string | null
          status?: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          responsavel_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendeu_projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vendeu_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_projetos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "vendeu_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      vendeu_responsaveis: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          departamento: string | null
          email: string
          empresa_id: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          departamento?: string | null
          email: string
          empresa_id?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          departamento?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendeu_responsaveis_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vendeu_empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      vendeu_reunioes: {
        Row: {
          aprovado_por: string | null
          ata_reuniao: string | null
          atualizado_em: string
          cliente_id: string | null
          criado_em: string
          criado_por: string | null
          data_aprovacao: string | null
          data_reuniao: string
          detalhes: string
          id: string
          objetivo: string | null
          observacoes_aprovacao: string | null
          participantes: string | null
          status: string
          titulo: string
        }
        Insert: {
          aprovado_por?: string | null
          ata_reuniao?: string | null
          atualizado_em?: string
          cliente_id?: string | null
          criado_em?: string
          criado_por?: string | null
          data_aprovacao?: string | null
          data_reuniao: string
          detalhes: string
          id?: string
          objetivo?: string | null
          observacoes_aprovacao?: string | null
          participantes?: string | null
          status?: string
          titulo?: string
        }
        Update: {
          aprovado_por?: string | null
          ata_reuniao?: string | null
          atualizado_em?: string
          cliente_id?: string | null
          criado_em?: string
          criado_por?: string | null
          data_aprovacao?: string | null
          data_reuniao?: string
          detalhes?: string
          id?: string
          objetivo?: string | null
          observacoes_aprovacao?: string | null
          participantes?: string | null
          status?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendeu_reunioes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "vendeu_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_reunioes_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "vendeu_usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      vendeu_tarefas: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          data_vencimento: string | null
          descricao: string | null
          empresa_id: string | null
          horas_estimadas: number | null
          horas_reais: number | null
          id: string
          prioridade: string
          projeto_id: string | null
          responsaveis_ids: string[] | null
          responsavel_id: string | null
          status: string
          titulo: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          empresa_id?: string | null
          horas_estimadas?: number | null
          horas_reais?: number | null
          id?: string
          prioridade?: string
          projeto_id?: string | null
          responsaveis_ids?: string[] | null
          responsavel_id?: string | null
          status?: string
          titulo: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          data_vencimento?: string | null
          descricao?: string | null
          empresa_id?: string | null
          horas_estimadas?: number | null
          horas_reais?: number | null
          id?: string
          prioridade?: string
          projeto_id?: string | null
          responsaveis_ids?: string[] | null
          responsavel_id?: string | null
          status?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendeu_tarefas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vendeu_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_tarefas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vendeu_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_tarefas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vendeu_projetos_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_tarefas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "vendeu_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      vendeu_usuarios: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          email: string
          empresa_id: string | null
          id: string
          nome: string
          papel: string
          perfil_id: string | null
          responsavel_id: string | null
          senha: string | null
          status: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          email: string
          empresa_id?: string | null
          id?: string
          nome: string
          papel?: string
          perfil_id?: string | null
          responsavel_id?: string | null
          senha?: string | null
          status?: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          papel?: string
          perfil_id?: string | null
          responsavel_id?: string | null
          senha?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendeu_usuarios_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vendeu_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_usuarios_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "vendeu_perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_usuarios_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "vendeu_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      waltenor_order_items: {
        Row: {
          commission: number
          commission_percentage: number
          created_at: string
          id: string
          order_id: string
          product_id: string
          product_line: string
          product_name: string
          quantity: number
          total: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          commission?: number
          commission_percentage?: number
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          product_line: string
          product_name: string
          quantity?: number
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          commission?: number
          commission_percentage?: number
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          product_line?: string
          product_name?: string
          quantity?: number
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "waltenor_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "waltenor_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waltenor_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "waltenor_products"
            referencedColumns: ["id"]
          },
        ]
      }
      waltenor_orders: {
        Row: {
          created_at: string
          customer_name: string
          date: string
          id: string
          invoice_number: string
          items: Json
          seller_id: string
          seller_name: string
          status: string
          total: number
          total_commission: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          date?: string
          id?: string
          invoice_number: string
          items?: Json
          seller_id: string
          seller_name: string
          status?: string
          total?: number
          total_commission?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          date?: string
          id?: string
          invoice_number?: string
          items?: Json
          seller_id?: string
          seller_name?: string
          status?: string
          total?: number
          total_commission?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "waltenor_orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "waltenor_sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      waltenor_products: {
        Row: {
          commission_percentage: number
          created_at: string
          id: string
          line: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          commission_percentage?: number
          created_at?: string
          id?: string
          line: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          commission_percentage?: number
          created_at?: string
          id?: string
          line?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      waltenor_profiles: {
        Row: {
          active: boolean
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      waltenor_sellers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      waltenor_users: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
          name: string
          password_hash: string
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          password_hash: string
          role?: string
          updated_at?: string
          username: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          password_hash?: string
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      obras_view: {
        Row: {
          ativo: boolean | null
          atualizado_em: string | null
          cep: string | null
          cidade: string | null
          cliente_id: string | null
          codigo: string | null
          criado_em: string | null
          data_fim_prevista: string | null
          data_fim_real: string | null
          data_inicio: string | null
          descricao: string | null
          email_contato: string | null
          endereco: string | null
          estado: string | null
          id: string | null
          nome: string | null
          observacoes: string | null
          orcamento: number | null
          pacote_id: string | null
          progresso: number | null
          responsavel_tecnico: string | null
          status: string | null
          telefone_contato: string | null
          tipo_obra_id: string | null
          valor_gasto: number | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cep?: string | null
          cidade?: string | null
          cliente_id?: string | null
          codigo?: string | null
          criado_em?: string | null
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio?: string | null
          descricao?: string | null
          email_contato?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string | null
          nome?: string | null
          observacoes?: string | null
          orcamento?: number | null
          pacote_id?: string | null
          progresso?: number | null
          responsavel_tecnico?: string | null
          status?: string | null
          telefone_contato?: string | null
          tipo_obra_id?: string | null
          valor_gasto?: number | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string | null
          cep?: string | null
          cidade?: string | null
          cliente_id?: string | null
          codigo?: string | null
          criado_em?: string | null
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio?: string | null
          descricao?: string | null
          email_contato?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string | null
          nome?: string | null
          observacoes?: string | null
          orcamento?: number | null
          pacote_id?: string | null
          progresso?: number | null
          responsavel_tecnico?: string | null
          status?: string | null
          telefone_contato?: string | null
          tipo_obra_id?: string | null
          valor_gasto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "obras_pacote_id_fkey"
            columns: ["pacote_id"]
            isOneToOne: false
            referencedRelation: "pacotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obras_tipo_obra_id_fkey"
            columns: ["tipo_obra_id"]
            isOneToOne: false
            referencedRelation: "tipos_obra"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sucena_obras_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "sucena_clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios_view: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          email: string | null
          id: string | null
          nome: string | null
          perfil: string | null
          senha_hash: string | null
          status: string | null
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          perfil?: string | null
          senha_hash?: string | null
          status?: string | null
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string | null
          nome?: string | null
          perfil?: string | null
          senha_hash?: string | null
          status?: string | null
        }
        Relationships: []
      }
      vendeu_dashboard_stats: {
        Row: {
          empresas_ativas: number | null
          projetos_ativos: number | null
          tarefas_atrasadas: number | null
          tarefas_concluidas: number | null
          tarefas_pendentes: number | null
          total_projetos: number | null
          total_tarefas: number | null
        }
        Relationships: []
      }
      vendeu_projetos_stats: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          empresa_id: string | null
          empresa_nome: string | null
          id: string | null
          nome: string | null
          percentual_conclusao: number | null
          responsavel_id: string | null
          responsavel_nome: string | null
          status: string | null
          tarefas_concluidas: number | null
          total_tarefas: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendeu_projetos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vendeu_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_projetos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "vendeu_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      vendeu_tarefas_completas: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          data_vencimento: string | null
          descricao: string | null
          empresa_id: string | null
          empresa_nome: string | null
          horas_estimadas: number | null
          horas_reais: number | null
          id: string | null
          prioridade: string | null
          projeto_id: string | null
          projeto_nome: string | null
          responsaveis_ids: string[] | null
          responsaveis_nomes: string | null
          responsavel_id: string | null
          status: string | null
          titulo: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendeu_tarefas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "vendeu_empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_tarefas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vendeu_projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_tarefas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "vendeu_projetos_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendeu_tarefas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "vendeu_responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calcular_percentual_construcao: {
        Args: { construcao_uuid: string }
        Returns: number
      }
      concrem_sn_hash_password: {
        Args: { password_text: string }
        Returns: string
      }
      concrem_sn_verify_password: {
        Args: { password_hash: string; password_text: string }
        Returns: boolean
      }
      consolidate_duplicate_socios: {
        Args: never
        Returns: {
          id_mantido: string
          ids_duplicados: string[]
          nome_socio: string
          registros_atualizados: number
        }[]
      }
      create_company_with_user: {
        Args: { name: string; slug: string; type: string; user_id?: string }
        Returns: Json
      }
      delete_obra: { Args: { p_id: string }; Returns: Json }
      donamenina_authenticate: {
        Args: { email_text: string; password_text: string }
        Returns: {
          email: string
          id: string
          nome: string
          role: Database["public"]["Enums"]["donamenina_app_role"]
        }[]
      }
      donamenina_has_role: {
        Args: {
          _role: Database["public"]["Enums"]["donamenina_app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      donamenina_hash_password: {
        Args: { password_text: string }
        Returns: string
      }
      donamenina_verify_password: {
        Args: { password_hash: string; password_text: string }
        Returns: boolean
      }
      force_postgrest_reload: { Args: never; Returns: undefined }
      get_current_user_empresa_id: { Args: never; Returns: string }
      get_current_user_id: { Args: never; Returns: string }
      get_current_user_role: { Args: never; Returns: string }
      get_obras: { Args: never; Returns: Json }
      get_user_companies: { Args: never; Returns: string[] }
      get_usuarios: { Args: never; Returns: Json }
      has_custom_user: { Args: never; Returns: boolean }
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { _role: string; _user_id: string }; Returns: boolean }
      hash_password: { Args: { password: string }; Returns: string }
      hash_password_cliente: {
        Args: { password_text: string }
        Returns: string
      }
      hash_password_secure: { Args: { password_text: string }; Returns: string }
      hash_password_vendeu: { Args: { password_text: string }; Returns: string }
      insert_obra: {
        Args: {
          p_cidade: string
          p_cliente_id: string
          p_codigo: string
          p_data_fim_prevista?: string
          p_data_inicio?: string
          p_descricao?: string
          p_estado: string
          p_nome: string
          p_orcamento?: number
          p_progresso?: number
          p_status?: string
        }
        Returns: Json
      }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { _user_id: string }; Returns: boolean }
      is_admin_user: { Args: never; Returns: boolean }
      is_authenticated_admin: { Args: never; Returns: boolean }
      log_audit_event: {
        Args: {
          p_action: string
          p_new_values?: Json
          p_old_values?: Json
          p_record_id?: string
          p_table_name: string
        }
        Returns: undefined
      }
      log_vendeu_security_event: {
        Args: { p_details?: Json; p_event_type: string; p_user_id?: string }
        Returns: undefined
      }
      reload_cache: { Args: never; Returns: string }
      set_current_user:
        | { Args: { user_id: string }; Returns: undefined }
        | { Args: { username: string }; Returns: undefined }
      sg_user_has_access_to_company: {
        Args: { empresa_uuid: string }
        Returns: boolean
      }
      sitensdrones_has_role: {
        Args: {
          _role: Database["public"]["Enums"]["sitensdrones_app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      sync_table_data: { Args: never; Returns: undefined }
      test_cache_reload: { Args: never; Returns: Json }
      update_obra: {
        Args: {
          p_cidade?: string
          p_cliente_id?: string
          p_codigo?: string
          p_data_fim_prevista?: string
          p_data_inicio?: string
          p_descricao?: string
          p_estado?: string
          p_id: string
          p_nome?: string
          p_orcamento?: number
          p_progresso?: number
          p_status?: string
        }
        Returns: Json
      }
      upsert_carregamentos:
        | { Args: { dados: Json }; Returns: Json }
        | { Args: { data_carregamento: string; pedidos: Json }; Returns: Json }
      verify_password: {
        Args: { hash: string; password: string }
        Returns: boolean
      }
      verify_password_cliente: {
        Args: { password_hash: string; password_text: string }
        Returns: boolean
      }
      verify_password_secure: {
        Args: { password_hash: string; password_text: string }
        Returns: boolean
      }
      verify_password_vendeu: {
        Args: { password_hash: string; password_text: string }
        Returns: boolean
      }
      waltenor_get_current_user_role: { Args: never; Returns: string }
      waltenor_is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
      asset_status: "active" | "inactive" | "maintenance" | "disposed" | "sold"
      combustivel_tipo: "DIESEL" | "GASOLINA" | "ETANOL"
      conservation_state: "excellent" | "good" | "regular" | "poor" | "critical"
      donamenina_app_role: "admin" | "operador"
      fuel_type: "gasoline" | "diesel" | "electric" | "hybrid" | "flex"
      incident_severity: "low" | "medium" | "high" | "critical"
      incident_type: "accident" | "theft" | "damage" | "maintenance" | "other"
      papel_usuario: "admin" | "rh" | "candidato"
      property_type:
        | "commercial"
        | "residential"
        | "industrial"
        | "land"
        | "warehouse"
      sitensdrones_app_role: "admin" | "user"
      status_candidato: "pendente" | "liberado" | "realizado" | "avaliado"
      status_funcionario: "ativo" | "ferias" | "licenca" | "rescisao"
      testehub_papel_usuario: "admin" | "rh" | "candidato"
      testehub_status_candidato:
        | "pendente"
        | "liberado"
        | "realizado"
        | "avaliado"
      testehub_tipo_questao: "multipla_escolha" | "discursiva"
      tipo_questao: "multipla_escolha" | "discursiva"
      user_role: "admin" | "manager" | "user" | "viewer"
      vehicle_type: "car" | "truck" | "motorcycle" | "bus" | "van" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      asset_status: ["active", "inactive", "maintenance", "disposed", "sold"],
      combustivel_tipo: ["DIESEL", "GASOLINA", "ETANOL"],
      conservation_state: ["excellent", "good", "regular", "poor", "critical"],
      donamenina_app_role: ["admin", "operador"],
      fuel_type: ["gasoline", "diesel", "electric", "hybrid", "flex"],
      incident_severity: ["low", "medium", "high", "critical"],
      incident_type: ["accident", "theft", "damage", "maintenance", "other"],
      papel_usuario: ["admin", "rh", "candidato"],
      property_type: [
        "commercial",
        "residential",
        "industrial",
        "land",
        "warehouse",
      ],
      sitensdrones_app_role: ["admin", "user"],
      status_candidato: ["pendente", "liberado", "realizado", "avaliado"],
      status_funcionario: ["ativo", "ferias", "licenca", "rescisao"],
      testehub_papel_usuario: ["admin", "rh", "candidato"],
      testehub_status_candidato: [
        "pendente",
        "liberado",
        "realizado",
        "avaliado",
      ],
      testehub_tipo_questao: ["multipla_escolha", "discursiva"],
      tipo_questao: ["multipla_escolha", "discursiva"],
      user_role: ["admin", "manager", "user", "viewer"],
      vehicle_type: ["car", "truck", "motorcycle", "bus", "van", "other"],
    },
  },
} as const
