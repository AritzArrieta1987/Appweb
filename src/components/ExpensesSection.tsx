import React from 'react';
import { ArrowDownRight, TrendingUp, Calendar, CreditCard, Building2, Users, Music, Megaphone, Server, Upload, FileText, X } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ExpensesSectionProps {
  expensesData: any;
  onAddExpense?: (expense: any) => void;
}

export function ExpensesSection({ expensesData, onAddExpense }: ExpensesSectionProps) {
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [newExpense, setNewExpense] = React.useState({
    category: 'Marketing',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    file: null as File | null
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewExpense({ ...newExpense, file: e.target.files[0] });
    }
  };

  const handleSubmitExpense = () => {
    if (newExpense.description && newExpense.amount && parseFloat(newExpense.amount) > 0) {
      const expense = {
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        date: new Date(newExpense.date).toLocaleDateString('es-ES'),
        icon: expensesData.categories.find((c: any) => c.name === newExpense.category)?.icon || CreditCard,
        color: expensesData.categories.find((c: any) => c.name === newExpense.category)?.color || '#c9a574',
        fileName: newExpense.file?.name
      };
      
      if (onAddExpense) {
        onAddExpense(expense);
      }
      
      // Resetear formulario
      setNewExpense({
        category: 'Marketing',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        file: null
      });
      setShowUploadModal(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Botón flotante para agregar gasto */}
      <button
        onClick={() => setShowUploadModal(true)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #c9a574 0%, #b8935d 100%)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(201, 165, 116, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(201, 165, 116, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(201, 165, 116, 0.4)';
        }}
      >
        <Upload size={28} color="#2a3f3f" />
      </button>

      {/* Header con resumen de gastos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Total de Gastos */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Gastos Totales
            </h3>
            <ArrowDownRight size={20} color="#c9a574" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#c9a574', marginBottom: '4px' }}>
            €{expensesData.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <TrendingUp size={14} color="#10b981" />
            <span style={{ color: '#10b981', fontWeight: '600' }}>
              -8.8%
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>vs mes anterior</span>
          </div>
        </div>

        {/* Gasto Promedio */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(201, 165, 116, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Promedio Mensual
            </h3>
            <Calendar size={20} color="#c9a574" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
            €{(expensesData.monthly.reduce((a: any, b: any) => a + b.amount, 0) / expensesData.monthly.length).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Últimos 6 meses
          </div>
        </div>

        {/* Categoría Mayor */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(201, 165, 116, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Mayor Categoría
            </h3>
            {React.createElement(expensesData.categories[0].icon, { size: 20, color: '#c9a574' })}
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
            {expensesData.categories[0].name}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
            €{expensesData.categories[0].value.toLocaleString('es-ES')}
          </div>
        </div>

        {/* Ahorro vs Presupuesto */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Ahorro
            </h3>
            <TrendingUp size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
            €3,729.25
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Bajo presupuesto
          </div>
        </div>
      </div>

      {/* Grid principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '24px'
      }}>
        {/* Columna izquierda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Gráfico de tendencia mensual */}
          <div style={{
            background: 'rgba(42, 63, 63, 0.3)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            minHeight: '380px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '20px' }}>
              Tendencia de Gastos Mensuales
            </h3>
            <div style={{ width: '100%', height: '280px', minHeight: '280px' }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={expensesData.monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 165, 116, 0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255, 255, 255, 0.6)"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="rgba(255, 255, 255, 0.6)"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(42, 63, 63, 0.95)',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value: any) => [`€${value.toLocaleString('es-ES')}`, 'Gastos']}
                    labelStyle={{ color: '#c9a574' }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {expensesData.monthly.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index === expensesData.monthly.length - 1 ? '#ef4444' : 'rgba(239, 68, 68, 0.5)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lista de gastos recientes */}
          <div style={{
            background: 'rgba(42, 63, 63, 0.3)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(201, 165, 116, 0.2)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '20px' }}>
              Gastos Recientes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {expensesData.recent.map((expense: any, index: number) => {
                const Icon = expense.icon;
                return (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: 'rgba(201, 165, 116, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(201, 165, 116, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 165, 116, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.1)';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: `${expense.color}20`,
                        border: `1px solid ${expense.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={20} color={expense.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                          {expense.description}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                          {expense.category} • {expense.date}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444' }}>
                      -€{expense.amount.toLocaleString('es-ES')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Gráfico de categorías */}
          <div style={{
            background: 'rgba(42, 63, 63, 0.3)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(201, 165, 116, 0.2)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '20px' }}>
              Por Categoría
            </h3>
            
            {/* Gráfico circular */}
            <div style={{ width: '100%', height: '220px', display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={expensesData.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expensesData.categories.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(42, 63, 63, 0.95)',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value: any) => `€${value.toLocaleString('es-ES')}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Lista de categorías */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {expensesData.categories.map((category: any, index: number) => {
                const Icon = category.icon;
                const percentage = (category.value / expensesData.total * 100).toFixed(1);
                return (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(201, 165, 116, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(201, 165, 116, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: `${category.color}20`,
                        border: `1px solid ${category.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={16} color={category.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                          {category.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                          {percentage}%
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
                      €{category.value.toLocaleString('es-ES')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparativa con mes anterior */}
          <div style={{
            background: 'rgba(42, 63, 63, 0.3)',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(201, 165, 116, 0.2)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '20px' }}>
              Comparativa Mensual
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>Mes Actual</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#ef4444' }}>€{expensesData.total.toLocaleString('es-ES')}</span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(expensesData.total / expensesData.lastMonth) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ef4444, #dc2626)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>Mes Anterior</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.5)' }}>€{expensesData.lastMonth.toLocaleString('es-ES')}</span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              <div style={{
                marginTop: '8px',
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                  Has ahorrado
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                  €{(expensesData.lastMonth - expensesData.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
                  8.8% menos que mayo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar gasto */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#2a3f3f',
            borderRadius: '20px',
            padding: '40px',
            border: '2px solid rgba(201, 165, 116, 0.3)',
            width: '500px',
            maxWidth: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>
                Agregar Gasto
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  background: 'rgba(201, 165, 116, 0.1)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                }}
              >
                <X size={18} color="#c9a574" />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Categoría */}
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#c9a574', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Categoría
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    background: 'rgba(42, 63, 63, 0.5)',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c9a574' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px',
                    paddingRight: '40px'
                  }}
                >
                  {expensesData.categories.map((category: any) => (
                    <option key={category.name} value={category.name} style={{ background: '#2a3f3f', color: '#ffffff', padding: '10px' }}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#c9a574', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Descripción
                </label>
                <input
                  type="text"
                  placeholder="Ej: Campaña publicitaria Facebook"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    background: 'rgba(42, 63, 63, 0.5)',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Monto y Fecha en grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Monto */}
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: '#c9a574', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Monto (€)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      background: 'rgba(42, 63, 63, 0.5)',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Fecha */}
                <div>
                  <label style={{ 
                    display: 'block',
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: '#c9a574', 
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      background: 'rgba(42, 63, 63, 0.5)',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Factura */}
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#c9a574', 
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Factura (Opcional)
                </label>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px dashed rgba(201, 165, 116, 0.3)',
                  background: 'rgba(201, 165, 116, 0.05)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.5)';
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.05)';
                }}>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  <FileText size={32} color="#c9a574" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '14px', color: '#c9a574', fontWeight: '600', marginBottom: '4px' }}>
                    {newExpense.file ? newExpense.file.name : 'Haz clic para subir factura'}
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    PDF, JPG, PNG (Máx. 10MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  borderRadius: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  color: '#c9a574',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitExpense}
                disabled={!newExpense.description || !newExpense.amount || parseFloat(newExpense.amount) <= 0}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  borderRadius: '12px',
                  background: !newExpense.description || !newExpense.amount || parseFloat(newExpense.amount) <= 0 
                    ? 'rgba(201, 165, 116, 0.2)' 
                    : 'linear-gradient(135deg, #c9a574 0%, #b8935d 100%)',
                  border: 'none',
                  color: !newExpense.description || !newExpense.amount || parseFloat(newExpense.amount) <= 0 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : '#2a3f3f',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: !newExpense.description || !newExpense.amount || parseFloat(newExpense.amount) <= 0 
                    ? 'not-allowed' 
                    : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: !newExpense.description || !newExpense.amount || parseFloat(newExpense.amount) <= 0 
                    ? 'none' 
                    : '0 4px 15px rgba(201, 165, 116, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (newExpense.description && newExpense.amount && parseFloat(newExpense.amount) > 0) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = !newExpense.description || !newExpense.amount || parseFloat(newExpense.amount) <= 0 
                    ? 'none' 
                    : '0 4px 15px rgba(201, 165, 116, 0.3)';
                }}
              >
                Agregar Gasto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}